import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import ContactsList from './ContactsList';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const HEADER_HEIGHT = 240;
const COLLAPSED_HEIGHT = 50;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

export default class TabViewDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'First' },
        { key: '2', title: 'Second' },
        { key: '3', title: 'Third' },
      ],
      scroll: new Animated.Value(0),
    };
  }

  _handleIndexChange = index => {
    this.setState({ index });
  };

  _renderHeader = props => {
    const translateY = this.state.scroll.interpolate({
      inputRange: [0, SCROLLABLE_HEIGHT],
      outputRange: [0, -SCROLLABLE_HEIGHT],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/900' }}
          style={styles.cover}>
          <View style={styles.overlay} />
          <TabBar {...props} style={styles.tabbar} />
        </ImageBackground>
      </Animated.View>
    );
  };

  _renderScene = () => {
    return (
      <ContactsList
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      />
    );
  };

  render() {
    return (
      <TabView
      ref={(tab) => { this.tab = tab }}
      navigationState={this.state}
      renderScene={this._renderScene}
      onIndexChange={index => this.setState({ index })}
      initialLayout={initialLayout}
      renderTabBar={this._renderHeader}
  />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .32)',
  },
  cover: {
    height: HEADER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tabbar: {
    backgroundColor: 'rgba(0, 0, 0, .32)',
    elevation: 0,
    shadowOpacity: 0,
  },
});
