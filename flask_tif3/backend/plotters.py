"""
        #percentages
        total = positives + negatives + neutrals
        pos_percentage = (positives / total)*100
        neg_percentage = (negatives / total)*100
        neu_percentage = (neutrals / total)*100

        #Word frequency
        fdist = FreqDist(lemmatized)
        df_fdist = pd.DataFrame.from_dict(fdist, orient='index')
        df_fdist.columns = ['Frequency']
        df_fdist.index.name = 'Term'
        df_fdist.sort_values(by=['Frequency'], inplace=True)

        # word cloud
        wordcloud = WordCloud(max_words=100, background_color="white").generate(" ".join(lemmatized))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis("off")
        plt.rcParams['figure.figsize'] = [300, 300]
        plt.savefig('word_cloud.png')
        plt.close()

        # Create pie chart
        labels = ["Positive [{}%]".format(positives), "Neutral [{}%]".format(neutrals), "Negative [{}%]".format(negatives)]
        sizes = [positives, neutrals, negatives]
        colors = ["yellowgreen", "blue", "red"]
        patches, texts = plt.pie(sizes, colors=colors, startangle=90)
        plt.style.use("default")
        plt.legend(labels)
        plt.title(f"Sentiment Analysis Result for keyword= pepsi")
        plt.axis("equal")
        plt.savefig('pie_chart.png')
        plt.close()
"""