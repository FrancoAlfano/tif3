"""import os
import re
import requests
import pandas as pd
from dotenv import load_dotenv
from nltk import pos_tag
from nltk.tokenize import TweetTokenizer
from nltk.probability import FreqDist
from nltk.stem import WordNetLemmatizer
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
import re
import statistics
from decimal import Decimal as D
from langdetect import detect
from flask import Flask, jsonify, request, render_template, url_for, flash, redirect
from flask import Flask, render_template, url_for, flash, redirect
from flask_restx import Namespace, Resource, fields
from models import Results

result_ns =Namespace("result", description="A namespace for results")

result_model=result_ns.model(
    "Results",
    {
        "id":fields.Integer(),
        "username":fields.String(),
        "tag":fields.String(),
        "positives":fields.Integer(),
        "negatives":fields.Integer(),
        "neutrals":fields.Integer(),
    }
)

@result_ns.route('/searchtag')
class SearchTag(Resource):
    @result_ns.expect(result_model)
    def post(self):
        data = request.get_json()
        tag=data.get('tag')
        username=data.get('username')

        def get_data(url,params):
            results = []
            for _ in range(10):
                response = requests.get(url, headers=headers, params=params)
                # Generate exception if response isn't ok
                if response.status_code != 200:
                    raise Exception(response.status_code, response.text)
                data = response.json()['data']
                meta_data = dict(response.json())['meta']
                results.append(pd.json_normalize(data))
                if 'next_token' not in meta_data:
                    break
                else:
                    token = meta_data['next_token']
                    params = {
                        'query': 'to:{} OR #{} OR @{} -is:retweet'.format(tag,tag,tag),
                        'next_token':token,
                        'max_results':50
                    }
            df = pd.concat(results)
            #as the twitter api doesn't correctly filter english tweets, we will do it here
            df['lang'] = df['text'].apply(lambda tweet: detect(tweet))
            df = df[df['lang']=='en']
            return df

        bearer_token = os.environ.get("Bearer")
        url ="https://api.twitter.com/2/tweets/search/recent"

        params = {
            'query': 'to:{} OR #{} OR @{} -is:retweet'.format(tag,tag,tag),
            'max_results': 50
        }

        headers = {
            "Authorization":f"Bearer {bearer_token}",
            "User-Agent":"v2FullArchiveSearchPython"
        }

        rm_urls = r'(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?'
        rm_hash = r'#'
        #rm_usr_mention = r'\B\@([\w\-]+)'
        rm_usr_mention = r'@'

        df = get_data(url, params)
        df['text'] = df['text'].str.replace(rm_urls, '', regex=True)
        df['text'] = df['text'].str.replace(rm_hash, '', regex=True)
        df['text'] = df['text'].str.replace(rm_usr_mention, '', regex=True)
        df['text'] = df['text'].str.lower()

        df.to_csv('{}.csv'.format(tag))

        #remove stop words from column
        stop_words = set(stopwords.words('english'))
        df['cleaned_stop_words'] = df["text"].apply(lambda x: ' '.join([word for word in x.split() if word not in (stop_words)]))

        # tokenize column
        tt = TweetTokenizer()
        tokenized_text = df['cleaned_stop_words'].apply(tt.tokenize)
        df["tokenized_text"] = tokenized_text

        #apply pos tag, adjectives
        tagged_ok = []
        for row in df["tokenized_text"]:
            tags = pos_tag(row)
            for word, tag in tags:
                if tag == "JJR" or tag == "JJS" or tag == "JJ":
                    tagged_ok.append((word, 'A'))

        #lemmatize
        wordnet_lemmatizer = WordNetLemmatizer()
        lemmatized = []
        for word, simbol in tagged_ok:
            lemmatized.append(wordnet_lemmatizer.lemmatize(word, simbol.lower()))

        # sentiment analysis
        sentiment_analyzer = SentimentIntensityAnalyzer()
        df["negative"] = ""
        df["neutral"] = ""
        df["positive"] = ""
        df["result"] = ""
        negatives = 0
        neutrals = 0
        positives = 0

        for index, row in df.iterrows():
            analisis = sentiment_analyzer.polarity_scores(row['text'])
            row["negative"] = analisis["neg"]
            row["neutral"] = analisis["neu"]
            row["positive"] = analisis["pos"]
            # fine tune what is considered positive or negative
            if analisis['compound'] > 0.6 :
                row["result"] = "Positive"
                positives += 1
            elif analisis['compound'] < 0.3:
                row["result"] = "Negative"
                negatives += 1
            else :
                row["result"] = "Neutral"
                neutrals += 1


        new_result=Results(
            tag= data.get('tag'),
            username = "admin",
            positives=positives,
            negatives=negatives,
            neutrals=neutrals
        )

        new_result.save()
        return jsonify({"message":"Search Complete!"})
"""