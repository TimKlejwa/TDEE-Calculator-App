import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  route: any; // Props to pass the data from the previous screen
};

const ResultScreen = ({ route }: Props) => {
  const {
    date,
    weight,
    goalWeight,
    goalChangePerWeek,
    height,
    age,
    gender,
    activityLevel,
  } = route.params; // Get the data passed from GetStartedScreen

  // Function to calculate TDEE
  const calculateTDEE = (weight: number, height: number, age: number, gender: string, activityLevel: string) => {
    let BMR = 0;

    // Calculate BMR based on gender
    if (gender === 'Male') {
      BMR = 66 + (13.75 * weight) + (5 * height) - (6.75 * age); // BMR for men
    } else if (gender === 'Female') {
      BMR = 655 + (9.56 * weight) + (1.85 * height) - (4.68 * age); // BMR for women
    }

    // Apply activity level to BMR
    let activityFactor = 1.2; // Sedentary by default
    if (activityLevel === 'Moderate') activityFactor = 1.55;
    if (activityLevel === 'High') activityFactor = 1.725;
    if (activityLevel === 'Extreme') activityFactor = 1.9;

    return BMR * activityFactor; // Total Daily Energy Expenditure (TDEE)
  };

  // Calculate TDEE
  const TDEE = calculateTDEE(weight, height, age, gender, activityLevel);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.text}>Start Date: {date.toLocaleDateString()}</Text>
      <Text style={styles.text}>Weight: {weight} lbs</Text>
      <Text style={styles.text}>Goal Weight: {goalWeight} lbs</Text>
      <Text style={styles.text}>Goal Change per Week: {goalChangePerWeek} lbs</Text>
      <Text style={styles.text}>Height: {height} inches</Text>
      <Text style={styles.text}>Age: {age} years</Text>
      <Text style={styles.text}>Gender: {gender}</Text>
      <Text style={styles.text}>Activity Level: {activityLevel}</Text>
      <Text style={styles.text}>TDEE: {TDEE.toFixed(2)} kcal/day</Text> {/* Display TDEE */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ResultScreen;