import pandas as pd
from wordcloud import WordCloud
from nltk.probability import FreqDist
import matplotlib.pyplot as plt
import datetime
import shutil
import os
import tempfile

def load_afinn_wordlist(filepath):
    afinn = {}
    with open(filepath, "r") as file:
        for line in file:
            word, score = line.strip().split("\t")
            afinn[word] = int(score)
    return afinn

def plott(positives, negatives, neutrals, lemmatized, tag):
    plt.switch_backend('agg')
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # Percentages
    total = positives + negatives + neutrals
    pos_percentage = round((positives / total) * 100, 2)
    neg_percentage = round((negatives / total) * 100, 2)
    neu_percentage = round((neutrals / total) * 100, 2)

    # Load AFINN-111 wordlist
    afinn_wordlist = load_afinn_wordlist("AFINN-111.txt")

    # Filter emotional words
    emotional_lemmatized = [word for word in lemmatized if word in afinn_wordlist]

    # Word frequency
    fdist = FreqDist(emotional_lemmatized)
    df_fdist = pd.DataFrame.from_dict(fdist, orient='index')
    df_fdist.columns = ['Frequency']
    df_fdist.index.name = 'Term'
    df_fdist.sort_values(by=['Frequency'], inplace=True, ascending=False)
    top_10_words = df_fdist.head(10)

    # Move the generated images to the desired location
    final_location = "/home/franco/universidad/tif3/flask_tif3/client/public/images/"
    temp_dir = tempfile.mkdtemp()  # Create a temporary directory

    # Generate word cloud
    wordcloud = WordCloud(width=800, height=400, background_color="white").generate_from_frequencies(fdist)
    filename = f"{tag}_word_cloud_{timestamp}.png"
    temp_filename = os.path.join(temp_dir, filename)
    wordcloud.to_file(temp_filename)
    wrd_cloud = temp_filename

    # Bar chart for word frequencies
    bar_colors = colors = ["#4c72b0"]
    plt.figure(figsize=(10, 6))
    plt.barh(top_10_words.index, top_10_words['Frequency'], color=bar_colors)
    plt.xlabel('Frequency', fontsize=20)
    plt.title('Top 10 Word Frequencies', fontsize=20)

    plt.subplots_adjust(left=0.3)  # Increase the left margin

    for i, freq in enumerate(top_10_words['Frequency']):
        # Position the labels slightly to the right of the bars
        plt.text(freq, i, str(freq), ha='left', va='center', fontsize=15, color='black')


    plt.gca().invert_yaxis()
    plt.yticks(fontsize=20)
    bar_chart_filename = f"{tag}_bar_chart_{timestamp}.png"
    temp_bar_chart_filename = os.path.join(temp_dir, bar_chart_filename)
    plt.savefig(temp_bar_chart_filename, dpi=300)
    bar_chart_path = os.path.join(final_location, bar_chart_filename)
    shutil.move(temp_bar_chart_filename, bar_chart_path)

    #Generate pie_chart
    colors = ["#55a868", "#c44e52", "#4c72b0"]
    plt.figure()
    wedges, _, autotexts = plt.pie([positives, negatives, neutrals], colors=colors, startangle=90, autopct='%1.1f%%')
    labels = ["Positive",
          "Negative",
          "Neutral"]
    plt.legend(wedges, labels, fontsize=12, loc="center left", bbox_to_anchor=(0, 0))
    plt.title("Pie chart for tag {}".format(tag), fontsize=15)
    plt.axis("equal")
    for autotext in autotexts:
        autotext.set_fontsize(15)
        autotext.set_color("white")
    pie_filename = "{}_pie_chart_{}.png".format(tag, timestamp)
    temp_pie_filename = os.path.join(temp_dir, pie_filename)
    plt.savefig(temp_pie_filename, dpi=200)
    p_chart = temp_pie_filename


    # Move the remaining generated images to the desired location
    final_wrd_cloud = os.path.join(final_location, filename)
    final_p_chart = os.path.join(final_location, pie_filename)
    shutil.move(wrd_cloud, final_wrd_cloud)
    shutil.move(p_chart, final_p_chart)

    return filename, pie_filename, bar_chart_filename
