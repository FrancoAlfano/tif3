from textblob import TextBlob
import sys
import tweepy
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import os
import nltk
import re
import string
from wordcloud import WordCloud, STOPWORDS
from PIL import Image
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from langdetect import detect
from nltk.stem import SnowballStemmer
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from dotenv import load_dotenv

load_dotenv()

consumerKey = os.environ.get("API_KEY")
consumerSecret = os.environ.get("API_KEY_SECRET")
accessToken = os.environ.get("ACCESS_TOKEN")
accessTokenSecret = os.environ.get("ACCESS_TOKEN_SECRET")
auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
auth.set_access_token(accessToken, accessTokenSecret)
api = tweepy.API(auth)

def percentage(part,whole):
 return 100 * float(part)/float(whole)

keyword = input("Please enter keyword or hashtag to search: ")
noOfTweet = int(input ("Please enter how many tweets to analyze: "))

positive = 0
negative = 0
neutral = 0
polarity = 0
tweet_list = []
neutral_list = []
negative_list = []
positive_list = []

tweets = tweepy.Cursor(api.search_tweets, q=keyword, lang='en', tweet_mode='extended').items(noOfTweet)

for tweet in tweets:
    tweet_list.append(tweet.full_text)
    analysis = TextBlob(tweet.full_text)
    score = SentimentIntensityAnalyzer().polarity_scores(tweet.full_text)
    neg = score["neg"]
    neu = score["neu"]
    pos = score["pos"]
    comp = score["compound"]
    polarity += analysis.sentiment.polarity
    
    if neg > pos:
        negative_list.append(tweet.full_text)
        negative += 1
    elif pos > neg:
        positive_list.append(tweet.full_text)
        positive += 1
    else:
        neutral_list.append(tweet.full_text)
        neutral += 1

# Calculate percentages
positive = (positive / noOfTweet) * 100
negative = (negative / noOfTweet) * 100
neutral = (neutral / noOfTweet) * 100
polarity = (polarity / noOfTweet) * 100

# Format percentages with one decimal point
positive = format(positive, ".1f")
negative = format(negative, ".1f")
neutral = format(neutral, ".1f")


print(positive, negative, neutral)