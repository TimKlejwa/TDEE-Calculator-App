import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  logo: {
    width: 150,
    height: 60,
  },
  dualColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
  },
  inputsSection: {
    width: '48%',
  },
  statsSection: {
    width: '48%',
  },
  tableSection: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#616161',
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  input: {
  width: 120, // Fixed width for all inputs
  borderWidth: 1,
  borderColor: '#BDBDBD',
  borderRadius: 5,
  padding: 8,
  fontSize: 14,
  backgroundColor: '#FAFAFA',
  minHeight: 40,
},
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  tableCell: {
    padding: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
  },
  tableInput: {
    padding: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  positionedPickerContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
});