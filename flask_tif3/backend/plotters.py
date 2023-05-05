import pandas as pd
from wordcloud import WordCloud
from nltk.probability import FreqDist
import matplotlib.pyplot as plt
import datetime


def plott(positives,negatives,neutrals, lemmatized, tag):
       #percentages
       total = positives + negatives + neutrals
       pos_percentage = round((positives / total)*100, 2)
       neg_percentage = round((negatives / total)*100, 2)
       neu_percentage = round((neutrals / total)*100, 2)

       #Word frequency
       fdist = FreqDist(lemmatized)
       df_fdist = pd.DataFrame.from_dict(fdist, orient='index')
       df_fdist.columns = ['Frequency']
       df_fdist.index.name = 'Term'
       df_fdist.sort_values(by=['Frequency'], inplace=True)
       df_fdist.to_csv("frequency")
        
       # Generate word cloud
       wordcloud = WordCloud(max_words=100, background_color="white").generate_from_frequencies(fdist)
       filename = f"graphs/{tag}_word_cloud_" + datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S") + ".png"
       wordcloud.to_file(filename)

       # Generate pie chart
       labels = ["Positive [{}%]".format(pos_percentage), "Neutral [{}%]".format(neu_percentage), "Negative [{}%]".format(neg_percentage)]
       sizes = [positives, neutrals, negatives]
       colors = ["yellowgreen", "blue", "red"]
       plt.pie(sizes, colors=colors, startangle=90)
       plt.legend(labels)
       plt.title(f"Sentiment Analysis Result for keyword= {tag}")
       plt.axis("equal")
       timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
       plt.savefig(f'graphs/{tag}_pie_chart_{timestamp}.png', dpi=200)
