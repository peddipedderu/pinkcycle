import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const youthImages = [
    require('../../assets/youth.jpeg'),
    require('../../assets/youth1.jpeg'),
    require('../../assets/youth2.jpeg'),
    require('../../assets/youth3.jpeg'),
    require('../../assets/youth4.jpeg'),
    require('../../assets/youth5.jpeg'),
    require('../../assets/youth6.jpeg'),
    require('../../assets/youth7.jpeg'),
    require('../../assets/youth8.jpeg'),
    require('../../assets/youth9.jpeg'),
    require('../../assets/youth10.jpeg'),
    require('../../assets/youth11.jpeg'),
    require('../../assets/youth12.jpeg'),
];

const BlogDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const scrollViewRef = useRef(null);
  const [commentsY, setCommentsY] = useState(0);

  // Animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchBlog();
    checkAuth();
  }, [id]);

  useEffect(() => {
    if (!loading && blog) {
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();

      if (route.params?.scrollToComments && commentsY > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: commentsY, animated: true });
        }, 500);
      }
    }
  }, [loading, blog, route.params?.scrollToComments, commentsY]);

  const checkAuth = async () => {
    let token = await AsyncStorage.getItem('token');
    if (!token && isWeb) {
      token = localStorage.getItem('userToken');
    }
    setIsAuthenticated(!!token);
  };

  const fetchBlog = async () => {
    try {
      const response = await client.get(`blog/${id}/`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      let token = await AsyncStorage.getItem('token');
      if (!token && isWeb) {
        token = localStorage.getItem('userToken');
      }
      
      await client.post('comments/', {
        blog: id,
        text: commentText,
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setCommentText('');
      fetchBlog();
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Could not post comment. Please ensure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <Text key={index} style={styles.contentHeader}>{line.replace('### ', '').trim()}</Text>;
      } else if (line.trim() === '') {
        return <View key={index} style={{ height: 15 }} />;
      } else {
        return <Text key={index} style={styles.contentText}>{line.trim()}</Text>;
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#db2777" />
      </View>
    );
  }

  if (!blog) return null;

  const blogImage = blog.image ? { uri: blog.image.startsWith('http') ? blog.image : `${blog.image.startsWith('/') ? blog.image : '/media/' + blog.image}` } : youthImages[blog.id % youthImages.length];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backButtonText}>BACK</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{blog.title.toUpperCase()}</Text>
        </View>

        <View style={styles.heroSection}>
            <Image 
              source={blogImage} 
              style={styles.heroImage} 
              resizeMode="cover" 
            />
            {blog.image_description ? (
                <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>{blog.image_description.toUpperCase()}</Text>
                </View>
            ) : null}
        </View>

        <Animated.View style={[styles.body, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <View style={styles.metaBox}>
            <View style={styles.authorBadge}>
                <Text style={styles.authorTag}>WRITTEN BY {blog.author.toUpperCase()}</Text>
            </View>
            <Text style={styles.dateTag}>{new Date(blog.created).toDateString().toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{blog.title}</Text>
          
          <View style={styles.mainContent}>
             {renderContent(blog.content)}
          </View>

          {blog.event_description ? (
              <View style={styles.eventBox}>
                <Text style={styles.eventBoxTitle}>EVENT LOG</Text>
                <View style={styles.eventDivider} />
                <Text style={styles.eventBoxText}>{blog.event_description}</Text>
              </View>
          ) : null}

          <View 
            style={styles.commentsSection}
            onLayout={(event) => setCommentsY(event.nativeEvent.layout.y)}
          >
            <View style={styles.commentsList}>
                {blog.comments && blog.comments.length > 0 ? (
                    blog.comments.map((comment) => (
                    <View key={comment.id} style={styles.commentCard}>
                        <View style={styles.commentHeader}>
                            <Text style={styles.commentUser}>@{comment.user.username.toUpperCase()}</Text>
                            <Text style={styles.commentDate}>{new Date(comment.created).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                    ))
                ) : (
                    <View style={styles.noCommentsBox}>
                        <Text style={styles.noComments}>STATION SILENT. BE THE FIRST TO TRANSMIT.</Text>
                    </View>
                )}
            </View>

            <View style={styles.commentFormContainer}>
                <Text style={styles.formTitle}>TRANSMIT FEEDBACK</Text>
                {isAuthenticated ? (
                <View style={styles.commentForm}>
                    <TextInput
                    style={styles.input}
                    placeholder="ENTER YOUR MESSAGE..."
                    placeholderTextColor="#777"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    />
                    <TouchableOpacity 
                    style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
                    onPress={handlePostComment}
                    disabled={submitting}
                    >
                    <Text style={styles.submitBtnText}>{submitting ? 'TRANSMITTING...' : 'POST COMMENT'}</Text>
                    </TouchableOpacity>
                </View>
                ) : (
                <TouchableOpacity 
                    style={styles.loginPrompt} 
                    onPress={() => navigation.navigate('Login', { returnTo: 'BlogDetail', returnId: id })}
                >
                    <Text style={styles.loginPromptText}>AUTHENTICATION REQUIRED TO COMMENT</Text>
                </TouchableOpacity>
                )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bottomBackBtn}
            onPress={() => navigation.goBack()}
          >
             <Text style={styles.bottomBackBtnText}>BACK TO ALL STORIES</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#111',
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 8,
    borderBottomColor: '#db2777',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '900',
    marginLeft: 8,
    fontSize: 14,
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
  },
  heroSection: {
    position: 'relative',
    height: 500,
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    backgroundColor: '#db2777',
    padding: 25,
    maxWidth: '85%',
    borderLeftWidth: 10,
    borderLeftColor: '#111',
  },
  imageBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 22,
  },
  body: {
    padding: 30,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#fff',
    marginTop: -40,
    borderWidth: 8,
    borderColor: '#111',
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 4,
    borderBottomColor: '#111',
    paddingBottom: 20,
  },
  authorBadge: {
    backgroundColor: '#111',
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#db2777',
  },
  authorTag: {
    fontWeight: '900',
    fontSize: 12,
    color: '#fff',
    letterSpacing: 1,
  },
  dateTag: {
    fontWeight: '900',
    fontSize: 14,
    color: '#888',
    letterSpacing: 1,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#111',
    lineHeight: 62,
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  mainContent: {
    marginBottom: 60,
  },
  contentHeader: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginTop: 35,
    marginBottom: 20,
    textTransform: 'uppercase',
    backgroundColor: '#111',
    padding: 15,
    alignSelf: 'flex-start',
    borderRightWidth: 8,
    borderRightColor: '#db2777',
  },
  contentText: {
    fontSize: 20,
    color: '#222',
    lineHeight: 34,
    marginBottom: 20,
    fontWeight: '500',
  },
  eventBox: {
    backgroundColor: '#111',
    padding: 40,
    marginBottom: 60,
    borderWidth: 4,
    borderColor: '#db2777',
  },
  eventBoxTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
    marginBottom: 15,
    letterSpacing: 3,
  },
  eventDivider: {
    height: 4,
    width: 60,
    backgroundColor: '#db2777',
    marginBottom: 20,
  },
  eventBoxText: {
    color: '#ccc',
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  commentsSection: {
    marginTop: 40,
    paddingTop: 40,
    borderTopWidth: 8,
    borderTopColor: '#111',
  },
  commentsList: {
    marginBottom: 50,
  },
  commentCard: {
    borderWidth: 4,
    borderColor: '#111',
    padding: 25,
    marginBottom: 25,
    backgroundColor: '#f9f9f9',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  commentUser: {
    fontWeight: '900',
    color: '#db2777',
    fontSize: 16,
    letterSpacing: 1,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '800',
  },
  commentText: {
    fontSize: 18,
    color: '#111',
    lineHeight: 26,
  },
  noCommentsBox: {
    padding: 40,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noComments: {
    fontSize: 16,
    color: '#999',
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  commentFormContainer: {
    backgroundColor: '#111',
    padding: 40,
    borderWidth: 4,
    borderColor: '#db2777',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 2,
  },
  commentForm: {
    gap: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: '#fff',
    padding: 20,
    fontSize: 18,
    height: 150,
    textAlignVertical: 'top',
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#db2777',
    padding: 22,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },
  loginPrompt: {
    padding: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#db2777',
  },
  loginPromptText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  bottomBackBtn: {
    marginTop: 60,
    backgroundColor: '#111',
    padding: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#db2777',
  },
  bottomBackBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 2,
  },
});

export default BlogDetail;
