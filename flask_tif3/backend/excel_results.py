import pandas as pd
from nltk import pos_tag
from nltk.tokenize import TweetTokenizer
from nltk.stem import WordNetLemmatizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from langdetect import detect
from models import Results
from plotters import plott
from flask import jsonify, request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
import cld3

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
        "word_cloud":fields.String(),
        "pie_chart":fields.String(),
        "frequency":fields.String()
    }
)

@result_ns.route('/results')
class ResultsResource(Resource):

    @result_ns.marshal_with(result_model)
    @result_ns.expect(result_model)
    @jwt_required()
    def get(self):
        """Get all results"""
        try:
            username = get_jwt_identity()
            results = Results.query.filter_by(username=username).all()
            return results
        except Exception as e:
            return jsonify({"message": "Token error: {}".format(str(e))}), 401


    @result_ns.marshal_with(result_model)
    @result_ns.expect(result_model)
    @jwt_required()
    def post(self):
        """Search a tag"""
        data = request.get_json()
        tag=data.get('tag')
        username = get_jwt_identity()

        rm_urls = r'(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?'
        rm_hash = r'#'
        rm_usr_mention = r'@'

        df = pd.read_csv(f'../data/{tag}.csv')

        #tweets_pulled = df.shape[0]

        #as the twitter api doesn't correctly filter english tweets, we will do it here
        df['lang'] = df['text'].apply(lambda tweet: cld3.get_language(tweet).language)
        df = df[df['lang'] == 'en']

        #deleting duplicated tweets
        df = df.drop_duplicates(subset=('text'))

        #apply regex to remove urls, hashes and user@ mentions
        df['text'] = df['text'].str.replace(rm_urls, '', regex=True)
        df['text'] = df['text'].str.replace(rm_hash, '', regex=True)
        df['text'] = df['text'].str.replace(rm_usr_mention, '', regex=True)
        df['text'] = df['text'].str.lower()

        #remove stop words from column
        stop_words = set(stopwords.words('english'))
        df['cleaned_stop_words'] = df["text"].apply(lambda x: ' '.
            join([word for word in x.split() if word not in (stop_words)]))
        
        # tokenize column
        tt = TweetTokenizer()
        tokenized_text = df['cleaned_stop_words'].apply(tt.tokenize)
        df["tokenized_text"] = tokenized_text
        
        #apply pos tag, adjectives
        tagged_ok = []
        for row in df["tokenized_text"]:
            tags = pos_tag(row)
            for word, tagg in tags:
                if tagg == "JJR" or tagg == "JJS" or tagg == "JJ":
                    tagged_ok.append((word, 'A'))

        #lemmatize
        wordnet_lemmatizer = WordNetLemmatizer()
        lemmatized = []
        for word, simbol in tagged_ok:
            lemmatized.append(wordnet_lemmatizer.lemmatize(word, simbol.lower()))

        #sentiment analysis
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
            if analisis['compound'] >= 0.05 :
                row["result"] = "Positive"
                positives += 1
            elif analisis['compound'] <= -0.05:
                row["result"] = "Negative"
                negatives += 1
            else :
                row["result"] = "Neutral"
                neutrals += 1

        #plot the word cloud and pie chart
        word_cloud, pie_chart, frequency =  plott(positives, negatives, neutrals, lemmatized, tag)

        new_result=Results(
            tag= data.get('tag'),
            username=username,
            positives=positives,
            negatives=negatives,
            neutrals=neutrals,
            word_cloud=word_cloud,
            pie_chart=pie_chart,
            frequency=frequency
        )
        
        new_result.save()

        return jsonify({"message":"Search Complete!"})


@result_ns.route('/result/<int:id>')
class ResultsResource(Resource):

    @result_ns.marshal_with(result_model)
    def get(self, id):
        """Get a result by id"""
        #if the id doesnt exist, return 404 not found
        result=Results.query.get_or_404(id)
        return result

    @result_ns.marshal_with(result_model)
    @jwt_required()
    def delete(self, id):
        """Delete result"""
        result_to_delete=Results.query.get_or_404(id)
        result_to_delete.delete()
        return result_to_delete