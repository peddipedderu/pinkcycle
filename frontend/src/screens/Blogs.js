import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const numColumns = isWeb && width > 768 ? 2 : 1;

const BlogCard = ({ item, navigation, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${item.image.startsWith('/') ? item.image : '/media/' + item.image}`) : null;

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
        styles.blogCardContainer
      ]}
    >
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('BlogDetail', { id: item.id })}
        style={[styles.blogCard, isWeb && width > 768 && styles.blogCardWeb]}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.blogImage} resizeMode="cover" />
          ) : (
            <View style={[styles.blogImage, styles.imagePlaceholder]}>
               <Text style={styles.placeholderText}>PINK CYCLE</Text>
            </View>
          )}
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{new Date(item.created).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.blogContent}>
          <Text style={styles.blogAuthor}>BY {item.author.toUpperCase()}</Text>
          <Text style={styles.blogTitle} numberOfLines={2}>{item.title.toUpperCase()}</Text>
          <Text style={styles.blogSnippet} numberOfLines={3}>
            {item.content.replace(/### /g, '').trim()}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.readMoreBtn}>
              <Text style={styles.readMoreText}>READ FULL STORY</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Blogs = ({ navigation }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBlogs();
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await client.get('blog/');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const ListHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerFade }]}>
      <Text style={styles.headerSubtitle}>LATEST NEWS & UPDATES</Text>
      <Text style={styles.headerTitle}>OUR BLOG</Text>
      <View style={styles.headerLine} />
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#db2777" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={blogs}
        renderItem={({ item, index }) => <BlogCard item={item} index={index} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blog posts available at the moment.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 60,
    backgroundColor: '#111',
    alignItems: 'center',
    borderBottomWidth: 15,
    borderBottomColor: '#db2777',
    marginBottom: 40,
  },
  headerSubtitle: {
    color: '#db2777',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 4,
    marginBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#db2777',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
  headerLine: {
    width: 100,
    height: 8,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  listContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 100,
  },
  blogCardContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 40,
  },
  blogCard: {
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#111',
    shadowColor: '#111',
    shadowOffset: { width: 12, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 20,
  },
  blogCardWeb: {
    // maxWidth handled by container
  },
  imageWrapper: {
    position: 'relative',
    height: 300,
    backgroundColor: '#eee',
    borderBottomWidth: 6,
    borderBottomColor: '#111',
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce7f3',
  },
  placeholderText: {
    color: '#db2777',
    fontWeight: '900',
    fontSize: 32,
  },
  dateBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: '#db2777',
    padding: 15,
    borderLeftWidth: 6,
    borderBottomWidth: 6,
    borderColor: '#111',
    zIndex: 10,
  },
  dateBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  blogContent: {
    padding: 30,
  },
  blogAuthor: {
    color: '#db2777',
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 12,
    letterSpacing: 2,
  },
  blogTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    marginBottom: 20,
    lineHeight: 34,
  },
  blogSnippet: {
    fontSize: 18,
    color: '#444',
    lineHeight: 26,
    marginBottom: 25,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderWidth: 3,
    borderColor: '#111',
  },
  readMoreText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    marginRight: 12,
    letterSpacing: 2,
  },
  emptyContainer: {
    padding: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    color: '#999',
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    backgroundColor: '#111',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#db2777',
    shadowColor: '#111',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
});

export default Blogs;
