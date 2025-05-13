import { styles } from '@/components/WeightTracker/styles'; // Use `@` alias or relative path
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

type WeekData = {
  weights: (number | null)[];
  calories: (number | null)[];
};

type Inputs = {
  startDate: Date;
  weightUnit: 'Lb' | 'Kg';
  calorieUnit: 'Cal' | 'kJ';
  startingWeight: number;
  goalWeight: number;
  goalGainPerWeek: number;
  dailySurplus: number;
  tdee: number;
};

const WeightTracker = () => {
  // State for user inputs
  const [inputs, setInputs] = useState<Inputs>({
    startDate: new Date('2020-11-12'),
    weightUnit: 'Lb',
    calorieUnit: 'Cal',
    startingWeight: 0,
    goalWeight: 0,
    goalGainPerWeek: 0,
    dailySurplus: 0,
    tdee: 0,
  });

  // State for weekly data
  const [weeks, setWeeks] = useState<WeekData[]>([
    ...Array(3).fill({ 
      weights: Array(7).fill(null), 
      calories: Array(7).fill(null) 
    })
  ]);

  // State for UI controls
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeightUnitPicker, setShowWeightUnitPicker] = useState(false);
  const [showCalorieUnitPicker, setShowCalorieUnitPicker] = useState(false);
  const [weightUnitPosition, setWeightUnitPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [calorieUnitPosition, setCalorieUnitPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Refs for input fields
const weightUnitRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);
const calorieUnitRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      const savedData = await AsyncStorage.getItem('weightTrackerData');
      if (savedData) {
        const data = JSON.parse(savedData);
        data.inputs.startDate = new Date(data.inputs.startDate);
        setInputs(data.inputs);
        setWeeks(data.weeks);
      }
    };
    loadData();
  }, []);

  // Save data when changed
  useEffect(() => {
    AsyncStorage.setItem('weightTrackerData', JSON.stringify({ inputs, weeks }));
  }, [inputs, weeks]);

  // Date formatting functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit' 
    }).replace(/ /g, '-');
  };

  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Calculate derived values
  const currentDate = new Date();
  const daysSinceStart = Math.floor(
    (currentDate.getTime() - inputs.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const currentWeekIndex = Math.floor(daysSinceStart / 7);
  const currentWeek = weeks[currentWeekIndex] || weeks[0];
  
  const validWeights = currentWeek.weights.filter((w): w is number => w !== null);
  const avgWeight = validWeights.length > 0 
    ? validWeights.reduce((a, b) => a + b, 0) / validWeights.length
    : inputs.startingWeight;
    
  const weightDelta = avgWeight - inputs.startingWeight;
  const goalWeeks = (inputs.goalWeight - inputs.startingWeight) / inputs.goalGainPerWeek;
  const goalDate = new Date(inputs.startDate.getTime() + goalWeeks * 7 * 24 * 60 * 60 * 1000);

  // Input change handler
  const handleInputChange = <K extends keyof Inputs>(field: K, value: Inputs[K]) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Week data change handler
  const handleWeekDataChange = (
    weekIndex: number,
    type: keyof WeekData,
    dayIndex: number,
    value: string
  ) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex] = { ...newWeeks[weekIndex] };
    newWeeks[weekIndex][type] = [...newWeeks[weekIndex][type]];
    
    const numericValue = value === '' ? null : 
      type === 'weights' ? parseFloat(value) : parseInt(value);
      
    newWeeks[weekIndex][type][dayIndex] = numericValue;
    setWeeks(newWeeks);
  };

  // Date picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('startDate', selectedDate);
    }
  };

  // Calculate average calories
  const calculateAvgCalories = (calories: (number | null)[]): string => {
    const validCalories = calories.filter((c): c is number => c !== null);
    return validCalories.length > 0 
      ? (validCalories.reduce((a, b) => a + b, 0) / validCalories.length).toFixed(0)
      : '';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Header */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Dual Column Section */}
        <View style={styles.dualColumn}>
          {/* Initial Inputs */}
          <View style={[styles.section, styles.inputsSection]}>
            <Text style={styles.sectionTitle}>Initial Inputs</Text>
            
            <View style={styles.inputRow}>
              <Text style={styles.label}>Start Date:</Text>
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formatDateString(inputs.startDate)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={inputs.startDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Weight Unit:</Text>
              <TouchableOpacity 
                ref={weightUnitRef}
                style={styles.input}
                onPress={() => {
                  weightUnitRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    setWeightUnitPosition({ x: pageX, y: pageY, width, height });
                    setShowWeightUnitPicker(true);
                  });
                }}
              >
                <Text>{inputs.weightUnit}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Calorie Unit:</Text>
              <TouchableOpacity 
                ref={calorieUnitRef}
                style={styles.input}
                onPress={() => {
                  calorieUnitRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    setCalorieUnitPosition({ x: pageX, y: pageY, width, height });
                    setShowCalorieUnitPicker(true);
                  });
                }}
              >
                <Text>{inputs.calorieUnit}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Starting Weight:</Text>
              <TextInput
                style={styles.input}
                value={inputs.startingWeight.toString()}
                keyboardType="numeric"
                onChangeText={(v) => handleInputChange('startingWeight', parseFloat(v) || 0)}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Goal Weight:</Text>
              <TextInput
                style={styles.input}
                value={inputs.goalWeight.toString()}
                keyboardType="numeric"
                onChangeText={(v) => handleInputChange('goalWeight', parseFloat(v) || 0)}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>Weekly Gain Goal:</Text>
              <TextInput
                style={styles.input}
                value={inputs.goalGainPerWeek.toString()}
                keyboardType="numeric"
                onChangeText={(v) => handleInputChange('goalGainPerWeek', parseFloat(v) || 0)}
              />
            </View>

          </View>
          {/* Current Stats */}
          <View style={[styles.section, styles.statsSection]}>
            <Text style={styles.sectionTitle}>Current Body Stats</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.label}>Today's Date:</Text>
              <Text style={styles.value}>{currentDate.toLocaleDateString()}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Current Weight:</Text>
              <Text style={styles.value}>{avgWeight.toFixed(1)} {inputs.weightUnit}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Weight Change:</Text>
              <Text style={[styles.value, { color: weightDelta >= 0 ? '#4CAF50' : '#F44336' }]}>
                {weightDelta.toFixed(1)} {inputs.weightUnit}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Estimated TDEE:</Text>
              <Text style={styles.value}>~{inputs.tdee} {inputs.calorieUnit}/day</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Goal Date:</Text>
              <Text style={styles.value}>{new Date(goalDate).toLocaleDateString()}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Daily Target:</Text>
              <Text style={styles.value}>{inputs.tdee + inputs.dailySurplus} {inputs.calorieUnit}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.label}>Weeks to Goal:</Text>
              <Text style={styles.value}>{goalWeeks.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress Table */}
        <View style={[styles.section, styles.tableSection]}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <ScrollView horizontal>
            <View>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeaderCell, { width: 100 }]}>Week</Text>
                <Text style={[styles.tableHeaderCell, { width: 65 }]}>Stats</Text>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Text key={day} style={[styles.tableHeaderCell, { width: 60 }]}>{day}</Text>
                ))}
                <Text style={[styles.tableHeaderCell, { width: 60 }]}>Avg.</Text>
                <Text style={[styles.tableHeaderCell, { width: 40 }]}>Δ</Text>
                <Text style={[styles.tableHeaderCell, { width: 60 }]}>TDEE</Text>
              </View>
              
              {/* Table Rows */}
              {weeks.map((week, weekIndex) => {
                const weekStart = new Date(inputs.startDate);
                weekStart.setDate(weekStart.getDate() + weekIndex * 7);
                const weekDate = formatDate(weekStart);
                
                const validWeekWeights = week.weights.filter((w): w is number => w !== null);
                const weekAvgWeight = validWeekWeights.length > 0 
                  ? validWeekWeights.reduce((a, b) => a + b, 0) / validWeekWeights.length
                  : null;
                  
                const weekWeightDelta = weekAvgWeight !== null 
                  ? weekAvgWeight - inputs.startingWeight 
                  : null;
                
                return (
                  <React.Fragment key={weekIndex}>
                    {/* Weight Row */}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { width: 100 }]}>{weekDate}</Text>
                      <Text style={[styles.tableCell, { width: 65 }]}>Weight</Text>
                      {week.weights.map((weight, dayIndex) => (
                        <TextInput
                          key={`weight-${dayIndex}`}
                          style={[styles.tableInput, { width: 60 }]}
                          value={weight !== null ? weight.toString() : ''}
                          keyboardType="numeric"
                          onChangeText={(v) => handleWeekDataChange(weekIndex, 'weights', dayIndex, v)}
                        />
                      ))}
                      <Text style={[styles.tableCell, { width: 60 }]}>
                        {weekAvgWeight !== null ? weekAvgWeight.toFixed(1) : ''}
                      </Text>
                      <Text style={[styles.tableCell, { width: 40 }]}>
                        {weekWeightDelta !== null ? weekWeightDelta.toFixed(1) : ''}
                      </Text>
                      <Text style={[styles.tableCell, { width: 60 }]}>{inputs.tdee}</Text>
                    </View>
                    
                    {/* Calories Row */}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { width: 100 }]}></Text>
                      <Text style={[styles.tableCell, { width: 65 }]}>Calories</Text>
                      {week.calories.map((cal, dayIndex) => (
                        <TextInput
                          key={`cal-${dayIndex}`}
                          style={[styles.tableInput, { width: 60 }]}
                          value={cal !== null ? cal.toString() : ''}
                          keyboardType="numeric"
                          onChangeText={(v) => handleWeekDataChange(weekIndex, 'calories', dayIndex, v)}
                        />
                      ))}
                      <Text style={[styles.tableCell, { width: 60 }]}>
                        {calculateAvgCalories(week.calories)}
                      </Text>
                      <Text style={[styles.tableCell, { width: 40 }]}></Text>
                      <Text style={[styles.tableCell, { width: 60 }]}></Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Weight Unit Picker */}
      {showWeightUnitPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowWeightUnitPicker(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={[
            styles.positionedPickerContainer,
            {
              top: weightUnitPosition.y + weightUnitPosition.height + 8,
              left: weightUnitPosition.x,
              width: weightUnitPosition.width
            }
          ]}>
            <Picker
              selectedValue={inputs.weightUnit}
              onValueChange={(itemValue) => {
                handleInputChange('weightUnit', itemValue);
                setShowWeightUnitPicker(false);
              }}
            >
              <Picker.Item label="Pounds (Lb)" value="Lb" />
              <Picker.Item label="Kilograms (Kg)" value="Kg" />
            </Picker>
          </View>
        </View>
      )}

      {/* Calorie Unit Picker */}
      {showCalorieUnitPicker && (
        <View style={styles.pickerOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowCalorieUnitPicker(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={[
            styles.positionedPickerContainer,
            {
              top: calorieUnitPosition.y + calorieUnitPosition.height + 8,
              left: calorieUnitPosition.x,
              width: calorieUnitPosition.width
            }
          ]}>
            <Picker
              selectedValue={inputs.calorieUnit}
              onValueChange={(itemValue) => {
                handleInputChange('calorieUnit', itemValue);
                setShowCalorieUnitPicker(false);
              }}
            >
              <Picker.Item label="Calories (Cal)" value="Cal" />
              <Picker.Item label="Kilojoules (kJ)" value="kJ" />
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
};

export default WeightTracker;