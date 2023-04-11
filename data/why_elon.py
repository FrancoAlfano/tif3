import os
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

load_dotenv()

def get_data(url,params):
    results = []
    for _ in range(100):
        response = requests.get(url, headers=headers, params=params)
        # Generar excepción si la respuesta no es exitosa
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
                'query': 'to:subway OR #subway OR @subway -is:retweet lang:en',
                #'query': 'to:kfc OR #kfc OR @kfc -is:retweet lang:en',
                #'query': '#pathofexile OR #poe @zizaran OR @Steelmage2 OR @MathilExists -is:retweet lang:en',
                #'query': 'from:pathofexile -is:retweet lang:en',
                #'query': '@bexsayswords -is:retweet lang:en',
                #'start_time': "2021-10-26T00:00:00Z",
                #'end_time': '2021-10-30T00:00:00Z',
                'next_token':token,
                'max_results':100
            }
    return pd.concat(results)

bearer_token = os.environ.get("Bearer")
url ="https://api.twitter.com/2/tweets/search/recent"

params = {
    'query': 'to:subway OR #subway OR @subway -is:retweet lang:en',
    #'query': 'to:kfc OR #kfc OR @kfc -is:retweet lang:en',
    #'query': '#pathofexile OR #poe @zizaran OR @Steelmage2 OR @MathilExists -is:retweet lang:en',
    #'query': 'from:pathofexile -is:retweet lang:en',
    #'query': '@bexsayswords -is:retweet lang:en',
    #'start_time': "2021-10-26T00:00:00Z",
    #'end_time': '2021-10-30T00:00:00Z',
    'max_results': 100
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

#df.to_csv('kfc.csv')
df.to_csv('subway.csv')


""" 

#Remover Stop Words de la columna
stop_words = set(stopwords.words('english'))
#new_stopwords = ['play', 'pathofexile', 'game', 'streamer', 'live', 'twitch', 'est', 'smallstreamer']
#new_stopwords_list = stop_words.union(new_stopwords)
df['cleaned_stop_words'] = df["text"].apply(lambda x: ' '.join([word for word in x.split() if word not in (stop_words)]))

# Aplicar Tokenizer a la columna
tt = TweetTokenizer()
tokenized_text = df['cleaned_stop_words'].apply(tt.tokenize)
df["tokenized_text"] = tokenized_text

#Aplicar pos tag, todos los adjetivos
tagged_ok = []
for row in df["tokenized_text"]:
    tags = pos_tag(row)
    for word, tag in tags:
        if tag == "JJR" or tag == "JJS" or tag == "JJ":
            tagged_ok.append((word, 'A'))

#Aplicar Lemmatizacion
wordnet_lemmatizer = WordNetLemmatizer()
lemmatized = []
for word, simbol in tagged_ok:
    lemmatized.append(wordnet_lemmatizer.lemmatize(word, simbol.lower()))

# Analizador de Sentimientos
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
    # Evaluar que valores se considerarán positivo o negativo
    if analisis['compound'] > 0.6 :
        row["result"] = "Positive"
        positives += 1
    elif analisis['compound'] < 0.3:
        row["result"] = "Negative"
        negatives += 1
    else :
        row["result"] = "Neutral"
        neutrals += 1

print(f"Positives= {positives}")
print(f"Neutrals= {neutrals}")
print(f"Negatives= {negatives}")


#Frecuencia de las palabras
fdist = FreqDist(lemmatized)
df_fdist = pd.DataFrame.from_dict(fdist, orient='index')
df_fdist.columns = ['Frequency']
df_fdist.index.name = 'Term'
df_fdist.sort_values(by=['Frequency'], inplace=True)
print(df_fdist)
all_tweets = []
for text in df["tokenized_text"]:
    all_tweets += text

# Grafico de Palabras
wordcloud = WordCloud(max_words=100, background_color="white").generate(" ".join(lemmatized))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.rcParams['figure.figsize'] = [300, 300]
plt.show()
 """