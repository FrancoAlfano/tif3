import pandas as pd
from wordcloud import WordCloud
from nltk.probability import FreqDist
import matplotlib.pyplot as plt
import datetime
import shutil
import os
import tempfile


def plott(positives, negatives, neutrals, lemmatized, tag):
       plt.switch_backend('agg')
       timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

       # Percentages
       total = positives + negatives + neutrals
       pos_percentage = round((positives / total) * 100, 2)
       neg_percentage = round((negatives / total) * 100, 2)
       neu_percentage = round((neutrals / total) * 100, 2)

       # Word frequency
       fdist = FreqDist(lemmatized)
       df_fdist = pd.DataFrame.from_dict(fdist, orient='index')
       df_fdist.columns = ['Frequency']
       df_fdist.index.name = 'Term'
       df_fdist.sort_values(by=['Frequency'], inplace=True)
       df_fdist.to_csv("frequency")

       # Generate word cloud
       wordcloud = WordCloud(max_words=100, background_color="white").generate_from_frequencies(fdist)
       filename = f"{tag}_word_cloud_{timestamp}.png"
       temp_dir = tempfile.mkdtemp()  # Create a temporary directory
       temp_filename = os.path.join(temp_dir, filename)
       wordcloud.to_file(temp_filename)
       wrd_cloud = temp_filename

       # Generate pie chart
       plt.pie([positives, neutrals, negatives], colors=["yellowgreen", "blue", "red"], startangle=90)
       plt.legend(["Positive [{}%]".format(pos_percentage), "Neutral [{}%]".format(neu_percentage), "Negative [{}%]".format(neg_percentage)])
       plt.title(f"Sentiment Analysis Result for keyword= {tag}")
       plt.axis("equal")
       pie_filename = f"{tag}_pie_chart_{timestamp}.png"
       temp_pie_filename = os.path.join(temp_dir, pie_filename)
       plt.savefig(temp_pie_filename, dpi=200)
       p_chart = temp_pie_filename

       # Move the generated images to the desired location
       final_location = "/home/franco/universidad/tif3/flask_tif3/client/public/images/"
       final_wrd_cloud = os.path.join(final_location, filename)
       final_p_chart = os.path.join(final_location, pie_filename)
       shutil.move(wrd_cloud, final_wrd_cloud)
       shutil.move(p_chart, final_p_chart)

       return filename, pie_filename
