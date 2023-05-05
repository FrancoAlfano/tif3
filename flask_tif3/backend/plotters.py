import pandas as pd
from wordcloud import WordCloud
from nltk.probability import FreqDist
import matplotlib.pyplot as plt



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
        wordcloud.to_file("word_cloud.png")

        # Generate pie chart
        labels = ["Positive [{}%]".format(pos_percentage), "Neutral [{}%]".format(neu_percentage), "Negative [{}%]".format(neg_percentage)]
        sizes = [positives, neutrals, negatives]
        colors = ["yellowgreen", "blue", "red"]
        plt.pie(sizes, colors=colors, startangle=90)
        plt.legend(labels)
        plt.title(f"Sentiment Analysis Result for keyword= {tag}")
        plt.axis("equal")
        plt.savefig('pie_chart.png', dpi=200)


        # # word cloud
        # wordcloud = WordCloud(max_words=100, background_color="white").generate(" ".join(lemmatized))
        # plt.imshow(wordcloud, interpolation='bilinear')
        # plt.axis("off")
        # plt.rcParams['figure.figsize'] = [300, 300]
        # plt.savefig('word_cloud.png')
        # plt.close()

        # # Create pie chart
        # labels = ["Positive [{}%]".format(positives), "Neutral [{}%]".format(neutrals), "Negative [{}%]".format(negatives)]
        # sizes = [positives, neutrals, negatives]
        # colors = ["yellowgreen", "blue", "red"]
        # patches, texts = plt.pie(sizes, colors=colors, startangle=90)
        # plt.style.use("default")
        # plt.legend(labels)
        # plt.title(f"Sentiment Analysis Result for keyword= pepsi")
        # plt.axis("equal")
        # plt.savefig('pie_chart.png')
        # plt.close()
