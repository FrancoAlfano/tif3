# Generate pie chart
# plt.figure()  # Create a new figure
# plt.pie([positives, neutrals, negatives], colors=["yellowgreen", "blue", "red"], startangle=90)
# plt.legend(["Positive [{}%]".format(pos_percentage),
#             "Neutral [{}%]".format(neu_percentage),
#             "Negative [{}%]".format(neg_percentage)])
# plt.title(f"Sentiment Analysis Result for keyword= {tag}")
# plt.axis("equal")

# pie_filename = f"{tag}_pie_chart_{timestamp}.png"
# temp_pie_filename = os.path.join(temp_dir, pie_filename)
# plt.savefig(temp_pie_filename, dpi=200)
# p_chart = temp_pie_filename


# Bar chart for word frequencies
# plt.figure(figsize=(10, 6))
# plt.barh(top_10_words.index, top_10_words['Frequency'])
# plt.xlabel('Frequency', fontsize=15)
# plt.title('Top 10 Word Frequencies', fontsize=15)
# for i, freq in enumerate(top_10_words['Frequency']):
#     plt.text(freq, i, str(freq), ha='left', va='center', fontsize=13)
# plt.gca().invert_yaxis()
# plt.yticks(fontsize=15)
# bar_chart_filename = f"{tag}_bar_chart_{timestamp}.png"
# temp_bar_chart_filename = os.path.join(temp_dir, bar_chart_filename)
# plt.savefig(temp_bar_chart_filename, dpi=300)
# bar_chart_path = os.path.join(final_location, bar_chart_filename)
# shutil.move(temp_bar_chart_filename, bar_chart_path)