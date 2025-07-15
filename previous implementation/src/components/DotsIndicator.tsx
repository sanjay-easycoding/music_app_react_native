import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface DotsIndicatorProps {
  total: number;
  current: number;
}

const DotsIndicator = ({ total, current }: DotsIndicatorProps) => {
  return (
    <View style={styles.container}>
      {[...Array(total)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: current === index ? '#fff' : 'rgba(255, 255, 255, 0.3)',
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default DotsIndicator; 