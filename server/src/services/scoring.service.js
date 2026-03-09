/**
 * Calculates percentage scores for each category based on user responses.
 * @param {Array} populatedResponses - Array of objects containing { score, questionId: { category } }
 * @returns {Object} - Object containing percentage scores for each category
 */
exports.calculateCategoryScores = (populatedResponses) => {
    // 1. Initialize trackers
    const rawScores = { Analytical: 0, Creative: 0, Social: 0, Technical: 0, Management: 0 };
    const maxPossibleScores = { Analytical: 0, Creative: 0, Social: 0, Technical: 0, Management: 0 };

    // 2. Loop through each answer
    populatedResponses.forEach(response => {
        const category = response.questionId.category;
        
        // Add the user's 1-5 score to the total for that category
        rawScores[category] += response.score;
        
        // Add 5 to the max possible score for that category (since 5 is the highest rating)
        maxPossibleScores[category] += 5; 
    });

    // 3. Calculate final percentages
    const percentages = {};
    for (const category in rawScores) {
        if (maxPossibleScores[category] > 0) {
            // (Raw Score / Max Possible) * 100
            percentages[category] = Math.round((rawScores[category] / maxPossibleScores[category]) * 100);
        } else {
            percentages[category] = 0; // If no questions existed for this category
        }
    }

    return percentages;
};