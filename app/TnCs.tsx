import React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';

const DocumentViewer = () => {
  const pages = [
    require('~/assets/TnC.png'),
    require('~/assets/TnC2.png'),
    require('~/assets/TnC3.png'),
    require('~/assets/TnC4.png'),
    require('~/assets/TnC5.png'),
    require('~/assets/TnC6.png'),
    require('~/assets/TnC7.png'),
    require('~/assets/TnC8.png'),
    require('~/assets/TnC9.png'),
    require('~/assets/TnC10.png'),
    require('~/assets/TnC11.png'),
    require('~/assets/TnC12.png'),
    require('~/assets/TnC13.png'),
    require('~/assets/TnC14.png'),
    // Add other pages here
  ];

  return (
    <ScrollView style={styles.container}>
      {pages.map((page, index) => (
        <Image key={index} source={page} style={styles.image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Adjust based on your page dimensions
    resizeMode: 'contain',
  },
});

export default DocumentViewer;
