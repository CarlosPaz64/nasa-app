import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../app/navigation/RootStackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ContestForm'>;

type FormValues = {
  name: string;
  phone: string;
  email: string;
  dob: string;
  country: string;
  acceptTerms: boolean;
};

const { width, height } = Dimensions.get('window');
const LIGHT_BG = '#FFFFFF';
const DARK_BG = '#222222';

export default function ContestFormScreen({ route, navigation }: Props) {
  const { contestId } = route.params;
  const [showCongrats, setShowCongrats] = useState(false);

  // theme
  const mode = useSelector((s: any) => s.theme.mode);
  const isLight = mode === 'light';

  // background animation
  const progress = useSharedValue(isLight ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(isLight ? 1 : 0, { duration: 500 });
  }, [isLight]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    position: 'absolute',
    width,
    height,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [DARK_BG, LIGHT_BG]
    ),
  }));
  const colors = {
    background: isLight ? LIGHT_BG : DARK_BG,
    text: isLight ? '#000000' : '#FFFFFF',
    placeholder: isLight ? '#666666' : '#AAAAAA',
    buttonLight: '#888888',
  };

  // date picker state
  const [showDobPicker, setShowDobPicker] = useState(false);

  // react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      dob: '',
      country: '',
      acceptTerms: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Submitted:', data);
    setShowCongrats(true);
  };
  const closeCongrats = () => {
    setShowCongrats(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Congratulations Modal */}
      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={closeCongrats}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Congrats! You’re now participating!
            </Text>
            <Button title="Close" onPress={closeCongrats} />
          </View>
        </View>
      </Modal>

      <Animated.View style={bgStyle} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Contest: {contestId}
        </Text>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <Text style={{ color: colors.text }}>Name</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.placeholder, color: colors.text }]}
                placeholder="Enter your name"
                placeholderTextColor={colors.placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Phone is required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <Text style={{ color: colors.text }}>Phone</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.placeholder, color: colors.text }]}
                placeholder="Enter your phone"
                placeholderTextColor={colors.placeholder}
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <Text style={{ color: colors.text }}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.placeholder, color: colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Date of Birth with calendar picker */}
        <Controller
          control={control}
          name="dob"
          rules={{ required: 'Birth date is required' }}
          render={({ field: { onChange, value }, fieldState }) => (
            <View style={styles.field}>
              <Text style={{ color: colors.text }}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowDobPicker(true)}
                style={[
                  styles.input,
                  { borderColor: colors.placeholder, justifyContent: 'center' },
                ]}
              >
                <Text style={{ color: value ? colors.text : colors.placeholder }}>
                  {value || 'Select date...'}
                </Text>
              </TouchableOpacity>
              {showDobPicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(e, selected) => {
                    setShowDobPicker(false);
                    if (selected) {
                      const iso = selected.toISOString().split('T')[0];
                      onChange(iso);
                    }
                  }}
                />
              )}
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Country */}
        <Controller
          control={control}
          name="country"
          rules={{ required: 'Country is required' }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <View style={styles.field}>
              <Text style={{ color: colors.text }}>Country</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.placeholder, color: colors.text }]}
                placeholder="Enter your country"
                placeholderTextColor={colors.placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Accept Terms */}
        <Controller
          control={control}
          name="acceptTerms"
          rules={{ validate: v => v || 'You must accept terms' }}
          render={({ field: { value, onChange }, fieldState }) => (
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => onChange(!value)}
                style={[
                  styles.checkbox,
                  { backgroundColor: value ? colors.text : 'transparent', borderColor: colors.text },
                ]}
              />
              <Text style={{ color: colors.text, marginLeft: 8 }}>
                Accept terms and conditions
              </Text>
              {fieldState.error && <Text style={styles.error}>{fieldState.error.message}</Text>}
            </View>
          )}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  error: { color: 'red', marginTop: 4 },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
});