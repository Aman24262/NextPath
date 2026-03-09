/**
 * Calculates a match percentage between user scores and a career's required skill matrix.
 * Uses a weighted absolute difference formula.
 */
exports.calculateMatchPercentage = (userScores, careerMatrix) => {
    const categories = ['Analytical', 'Creative', 'Social', 'Technical', 'Management'];
    
    let totalDifference = 0;
    let maxPossibleDifference = categories.length * 100; // 5 categories * 100% = 500

    // Compare each category
    categories.forEach(category => {
        const userScore = userScores[category] || 0;
        const careerScore = careerMatrix[category] || 0;
        
        // Add the difference between the user's score and what the career needs
        totalDifference += Math.abs(userScore - careerScore);
    });

    // Calculate how close they are to a perfect 100% match
    const matchPercentage = ((maxPossibleDifference - totalDifference) / maxPossibleDifference) * 100;
    
    // Return a clean, rounded number (e.g., 87)
    return Math.round(matchPercentage);
};