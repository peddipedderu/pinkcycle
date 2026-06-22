import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  TextInput,
  Platform,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const FadeInView = ({ children, delay = 0, duration = 800, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};


const DynamicBackground = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 20000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 20000, useNativeDriver: true }),
      ])
    ).start();

    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % images.length);
        fadeAnim.setValue(0);
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [nextIndex, images.length]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.Image 
        source={images[currentIndex]} 
        style={[styles.heroImage, { transform: [{ scale: scaleAnim }] }]} 
        resizeMode="cover" 
      />
      <Animated.Image
        source={images[nextIndex]}
        style={[styles.heroImage, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="cover" 
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.4)" }]} />
    </View>
  );
};

const ImpactStat = ({ count, label, duration = 2000 }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const target = parseInt(count.replace(/[^0-9]/g, ''));
  const suffix = count.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime = Math.max(totalMiliseconds / end, 10);

    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / 50)); // Smoother for large numbers
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayCount(start);
    }, 50);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <View style={styles.statBox}>
      <Text style={styles.statCount}>{displayCount}{suffix}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const PinkCycleHome = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const scrollRef = useRef(null);
  const sectionRefs = {
    pillars: useRef(0),
    about: useRef(0),
    catalog: useRef(0),
    programs: useRef(0),
    difference: useRef(0),
    contact: useRef(0),
  };

  useEffect(() => {
    if (route.params?.scrollTo && scrollRef.current) {
      const section = route.params.scrollTo;
      const yOffset = sectionRefs[section].current;
      scrollRef.current.scrollTo({ y: yOffset, animated: true });
    }
  }, [route.params?.scrollTo]);

  const onSectionLayout = (section) => (event) => {
    sectionRefs[section].current = event.nativeEvent.layout.y;
  };

  const handleBookSession = () => {
    if (Platform.OS === 'web') {
      const token = localStorage.getItem('userToken');
      if (token) {
        navigation.navigate('Booking');
      } else {
        navigation.navigate('Registration');
      }
    } else {
      navigation.navigate('Registration');
    }
  };

  const QuickLink = ({ icon, title, color, delay }) => (
    <FadeInView delay={delay} style={styles.quickLinkWrapper}>
      <TouchableOpacity style={[styles.quickLinkBlock, { borderColor: color + '40' }]}>
        <View style={[styles.quickLinkIcon, { backgroundColor: color + '15' }]}>
          <MaterialCommunityIcons name={icon} size={34} color={color} />
        </View>
        <Text style={[styles.quickLinkTitle, { color: color }]}>{title}</Text>
      </TouchableOpacity>
    </FadeInView>
  );

  const ProgramCard = ({ title, overview, impact, icon, delay, navigation }) => (
    <FadeInView delay={delay} style={{ width: '100%' }}>
      <View style={styles.programCard}>
        <View style={styles.programHeader}>
          <MaterialCommunityIcons name={icon} size={32} color="#db2777" />
          <Text style={styles.programTitle}>{title}</Text>
        </View>
        <Text style={styles.programOverview}>{overview}</Text>
        <View style={styles.programImpactBadge}>
          <Text style={styles.programImpactText}>IMPACT: {impact}</Text>
        </View>
        <TouchableOpacity style={styles.programButton} onPress={() => navigation.navigate("Programs", { programTitle: title })} >
          <Text style={styles.programButtonText}>Explore Program</Text>
        </TouchableOpacity>
      </View>
    </FadeInView>
  );

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

  const scrollToSection = (section) => {
     if (scrollRef.current && sectionRefs[section]) {
        scrollRef.current.scrollTo({ y: sectionRefs[section].current, animated: true });
     }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <Text style={styles.logoText}>Pink Cycle <Text style={styles.logoAccent}>EmpowerHer</Text></Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          {Platform.OS === 'web' && width > 800 && (
            <View style={styles.webNav}>
               <TouchableOpacity onPress={() => scrollRef.current.scrollTo({y: 0, animated: true})}><Text style={styles.webNavLink}>Home</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => scrollToSection('about')}><Text style={styles.webNavLink}>About</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => scrollToSection('pillars')}><Text style={styles.webNavLink}>Pillars</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => scrollToSection('catalog')}><Text style={styles.webNavLink}>Catalog</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate('Programs')}><Text style={styles.webNavLink}>Programs</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => { if (Platform.OS === 'web') { navigation.navigate('Donate'); } else { scrollToSection('difference'); } }}><Text style={styles.webNavLink}>Impact</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => scrollToSection('contact')}><Text style={styles.webNavLink}>Contact</Text></TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate('Account')}><Text style={styles.webNavLink}>Account</Text></TouchableOpacity>
               <TouchableOpacity onPress={handleBookSession} style={[styles.heroPrimaryBtn, { paddingVertical: 8, paddingHorizontal: 15, marginLeft: 10 }]}><Text style={[styles.heroPrimaryBtnText, { fontSize: 12 }]}>Book Session</Text></TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons name="menu" size={32} color="#831843" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.container}>
        {/* 1. Hero Banner */}
        <View style={styles.heroSection}>
          <DynamicBackground images={[require("../../assets/pink.jpeg"), ...youthImages]} />
          <View style={styles.heroOverlay}>
            <FadeInView delay={200}>
              <Text style={styles.heroTagline}>EMPOWERING WOMEN AND GIRLS</Text>
            </FadeInView>
            <FadeInView delay={400}>
              <Text style={styles.heroTitle}>Breaking Barriers.{"\n"}Empowering Futures.</Text>
            </FadeInView>
            <FadeInView delay={600} style={styles.heroButtons}>
              <TouchableOpacity style={styles.heroPrimaryBtn} onPress={handleBookSession}>
                <Text style={styles.heroPrimaryBtnText}>Book Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => navigation.navigate('JoinUs')}>
                <Text style={styles.heroPrimaryBtnText}>Join Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroPrimaryBtn} onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.heroPrimaryBtnText}>Visit Our Community Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroSecondaryBtn} onPress={() => { if (Platform.OS === 'web') { navigation.navigate('Donate'); } else { scrollToSection('difference'); } }}>
                <Text style={styles.heroSecondaryBtnText}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroSecondaryBtn} onPress={() => navigation.navigate('Blogs')}>
                <Text style={styles.heroSecondaryBtnText}>Read Blog</Text>
              </TouchableOpacity>
            </FadeInView>
            <FadeInView delay={800}>
              <TouchableOpacity style={styles.heroGhostBtn} onPress={() => scrollToSection('programs')}>
                <Text style={styles.heroGhostBtnText}>Explore Programs →</Text>
              </TouchableOpacity>
            </FadeInView>
          </View>
        </View>

        {/* Impact Highlights Bar */}
        <FadeInView delay={1000} style={styles.impactBar}>
          <ImpactStat count="500+" label="Youth Trained" />
          <ImpactStat count="200+" label="Girls Empowered" />
          <ImpactStat count="10+" label="Events" />
        </FadeInView>

        {/* 2. Strategic Pillars */}
        <View style={styles.section} onLayout={onSectionLayout('pillars')}>
          <FadeInView>
            <Text style={styles.sectionTitleCenter}>Strategic Pillars</Text>
          </FadeInView>
          <View style={styles.pillarsGrid}>
            <QuickLink icon="laptop" title="Digital Literacy" color="#db2777" delay={200} />
            <QuickLink icon="water" title="Menstrual Health" color="#be185d" delay={400} />
            <QuickLink icon="leaf" title="Climate Action" color="#15803d" delay={600} />
            <QuickLink icon="account-group" title="Mentorship" color="#0369a1" delay={800} />
          </View>
        </View>

        {/* 3. About Us */}
        <View style={[styles.section, { backgroundColor: '#fdf2f8' }]} onLayout={onSectionLayout('about')}>
          <FadeInView>
            <Text style={styles.sectionTitle}>About Pink Cycle</Text>
          </FadeInView>
          <View style={styles.missionVisionBox}>
            <FadeInView delay={200} style={styles.mvItem}>
              <Text style={styles.mvLabel}>OUR MISSION</Text>
              <Text style={styles.mvText}>Empower women and youth through menstrual health education, digital literacy, and climate-conscious solutions.</Text>
            </FadeInView>
            <FadeInView delay={400} style={styles.mvItem}>
              <Text style={styles.mvLabel}>OUR VISION</Text>
              <Text style={styles.mvText}>A society where every girl has dignity, opportunity, and access to education.</Text>
            </FadeInView>
          </View>

          <FadeInView delay={600} style={styles.founderSection}>
            <View style={styles.founderImagesRow}>
              <Image
                source={require('../../assets/logo.jpeg')}
                style={styles.sideFounderImage}
              />
              <Image
                source={require('../../assets/Karen.png')}
                style={styles.mainFounderImage}
              />
              <Image
                source={require('../../assets/founder.jpeg')}
                style={styles.sideFounderImage}
              />
            </View>
            <Text style={styles.founderTitle}>Founder’s Message</Text>
            <Text style={styles.founderQuote}>
              "In my community, I grew up seeing girls and young people held back not because they lacked talent, but because they lacked access... That is why I founded Pink Cycle EmpowerHer Initiative — to break the silence, to open doors, and to show that every girl and youth deserves dignity, knowledge, and opportunity."
            </Text>
            <Text style={styles.founderName}>Miss Caren</Text>
            <Text style={styles.founderRole}>Founder & Executive Director</Text>
          </FadeInView>

          <View style={styles.valuesContainer}>
            {['Inclusivity', 'Sustainability', 'Empowerment', 'Innovation'].map((val, idx) => (
              <FadeInView key={val} delay={800 + (idx * 100)} style={styles.valueBadge}>
                <Text style={styles.valueText}>{val}</Text>
              </FadeInView>
            ))}
          </View>
        </View>

        {/* 4. Youth Empowerment Catalog */}
        <View style={[styles.section, { backgroundColor: '#1a0614' }]} onLayout={onSectionLayout('catalog')}>
          <FadeInView>
            <Text style={[styles.sectionTitle, { color: '#fce7f3', textAlign: 'center' }]}>Youth Empowerment Catalog</Text>
            <Text style={styles.catalogSubtitle}>Showcasing the vibrant future of our community</Text>
          </FadeInView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
          >
            {youthImages.map((img, index) => (
              <FadeInView key={index} delay={index * 100} style={styles.youthCard}>
                <Image source={img} style={styles.catalogImage} resizeMode="cover" />
                <View style={styles.youthBadge}>
                   <Text style={styles.youthBadgeText}>Future Leader</Text>
                </View>
              </FadeInView>
            ))}
          </ScrollView>
        </View>

        {/* 5. Programs & Initiatives */}
        <View style={styles.section} onLayout={onSectionLayout('programs')}>
          <FadeInView>
            <Text style={styles.sectionTitle}>Programs & Initiatives</Text>
          </FadeInView>
          <ProgramCard navigation={navigation}
            title="Digital Literacy & ICT Skills"
            overview="Equipping youth aged 15–25 with coding (Python, HTML, CSS), AI integration, and cybersecurity."
            impact="Over 500 girls in Bungoma have already benefited."
            icon="code-braces"
            delay={200}
          />
          <ProgramCard navigation={navigation}
            title="Menstrual Health & Hygiene"
            overview="Breaking taboos through school visits and distribution of dignity kits (pads, soap, underwear)."
            impact="Reduced absenteeism and stigma in local schools."
            icon="heart-pulse"
            delay={400}
          />
          <ProgramCard navigation={navigation}
            title="Climate-Conscious Solutions"
            overview="Tree planting, recycling training, and green entrepreneurship for a sustainable future."
            impact="Promotes environmental stewardship among youth."
            icon="sprout"
            delay={600}
          />
          <ProgramCard navigation={navigation}
            title="Mentorship & Leadership"
            overview="One-on-one sessions with professionals to build confidence and innovation capacity."
            impact="Nurtures the next generation of confident leaders."
            icon="account-star"
            delay={800}
          />
        </View>

        {/* 6. Upcoming Events */}
        <View style={styles.section}>
          <FadeInView style={styles.eventCard}>
            <Text style={styles.eventTag}>UPCOMING EVENT</Text>
            <Text style={styles.eventTitle}>Youth Empowerment Program 2026</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="calendar" size={16} color="#db2777" />
              <Text style={{ fontSize: 16, color: '#831843', fontWeight: '600', marginLeft: 10 }}>June 1st – June 30th, 2026</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="location" size={16} color="#db2777" />
              <Text style={{ fontSize: 16, color: '#831843', fontWeight: '600', marginLeft: 10 }}>Kanduyi Community ICT Hub</Text>
            </View>
            <TouchableOpacity style={styles.registerBtn} onPress={() => { if (Platform.OS === 'web') { window.location.href = '/registration'; } else { navigation.navigate('Registration'); } }}>
              <Text style={styles.registerBtnText}>Register Now</Text>
            </TouchableOpacity>
          </FadeInView>
        </View>

        {/* 7. Donation & Support */}
        <View style={[styles.section, { backgroundColor: '#fdf2f8' }]} onLayout={onSectionLayout('difference')}>
          <FadeInView>
            <Text style={styles.sectionTitleCenter}>Make a Difference</Text>
            <Text style={styles.donationLead}>Every coin helps break barriers in menstrual health, digital literacy, and climate-conscious solutions.</Text>
          </FadeInView>
          <View style={styles.donationGrid}>
            <FadeInView delay={200} style={styles.donationTierWrapper}>
              <View style={styles.donationTier}><Text style={styles.tierAmt}>$10</Text><Text style={styles.tierLabel}>Dignity Kit</Text></View>
            </FadeInView>
            <FadeInView delay={400} style={styles.donationTierWrapper}>
              <View style={styles.donationTier}><Text style={styles.tierAmt}>$50</Text><Text style={styles.tierLabel}>ICT Training</Text></View>
            </FadeInView>
            <FadeInView delay={600} style={styles.donationTierWrapper}>
              <View style={styles.donationTier}><Text style={styles.tierAmt}>$100</Text><Text style={styles.tierLabel}>Workshop</Text></View>
            </FadeInView>
          </View>
          <FadeInView delay={800}>
            <TouchableOpacity style={styles.donateLargeBtn} onPress={() => { if (Platform.OS === 'web') { navigation.navigate('Donate'); } }} >
              <Text style={styles.donateLargeBtnText}>Donate Today</Text>
            </TouchableOpacity>
          </FadeInView>
        </View>

        {/* 8. Contact Us */}
        <View style={styles.section} onLayout={onSectionLayout('contact')}>
          <FadeInView>
            <Text style={styles.sectionTitle}>Get In Touch</Text>
          </FadeInView>
          <FadeInView delay={200} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#831843', textAlign: 'center', marginBottom: 20 }}>
              Have questions or want to partner with us? We'd love to hear from you.
            </Text>
            <TouchableOpacity style={[styles.sendBtn, { width: '100%' }]} onPress={() => navigation.navigate('SendMessage')}>
              <Text style={styles.sendBtnText}>Go to Message Page</Text>
            </TouchableOpacity>
          </FadeInView>
          <FadeInView delay={400} style={styles.contactInfo}>
            <Text style={styles.contactText}>📍 Kanduyi, Bungoma County, Kenya</Text>
            <View style={styles.socialRow}>
              <FontAwesome5 name="linkedin" size={24} color="#831843" />
              <FontAwesome5 name="instagram" size={24} color="#831843" />
              <FontAwesome5 name="facebook" size={24} color="#831843" />
            </View>
          </FadeInView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerCopyright}>© 2026 PINK CYCLE EMPOWERHER INITIATIVE</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
    backgroundColor: '#fff',
    zIndex: 100,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#831843',
  },
  logoAccent: {
    color: '#db2777',
  },
  webNav: {
    flexDirection: 'row',
    gap: 20,
    marginRight: 20,
  },
  webNavLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#831843',
  },
  container: {
    flex: 1,
  },
  heroSection: {
    height: 500,
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
    position: 'absolute',
  },
  heroOverlay: {
    padding: 30,
    justifyContent: 'center',
    height: '100%',
  },
  heroTagline: {
    color: '#f9a8d4',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 50,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    backgroundColor: '#db2777',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 8,
  },
  heroPrimaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  heroSecondaryBtn: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 8,
  },
  heroSecondaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  heroGhostBtn: {
    marginTop: 10,
  },
  heroGhostBtnText: {
    color: '#fce7f3',
    fontWeight: '600',
  },
  impactBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 30,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    minWidth: 100,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(219, 39, 119, 0.1)',
      },
    }),
  },
  statCount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#db2777',
  },
  statLabel: {
    fontSize: 12,
    color: '#831843',
    fontWeight: '700',
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#831843',
    marginBottom: 25,
  },
  sectionTitleCenter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#831843',
    textAlign: 'center',
    marginBottom: 40,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  quickLinkWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  quickLinkBlock: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quickLinkIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  missionVisionBox: {
    gap: 20,
    marginBottom: 40,
  },
  mvItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    
    
  },
  mvLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#db2777',
    marginBottom: 10,
  },
  mvText: {
    fontSize: 16,
    color: '#831843',
    lineHeight: 24,
  },
  founderSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  founderImagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  mainFounderImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 5,
    borderColor: '#fff',
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sideFounderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  founderImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 6,
    borderColor: '#fff',
    marginBottom: 25,
  },
  founderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#831843',
    marginBottom: 15,
  },
  founderQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#831843',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  founderName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#db2777',
  },
  founderRole: {
    fontSize: 14,
    color: '#831843',
    fontWeight: '600',
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
  },
  valueBadge: {
    backgroundColor: '#db2777',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  valueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  youthCard: {
    width: 320,
    height: 450,
    backgroundColor: '#fff',
    marginRight: 25,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
    elevation: 12,
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15
  },
  catalogImage: {
    width: '100%',
    height: '100%',
  },
  youthBadge: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    backgroundColor: 'rgba(219, 39, 119, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  youthBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  catalogSubtitle: {
    color: '#f9a8d4',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 16,
    opacity: 0.9
  },
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fce7f3',
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#831843',
    flex: 1,
  },
  programOverview: {
    fontSize: 15,
    color: '#831843',
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 15,
  },
  programImpactBadge: {
    backgroundColor: '#fdf2f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  programImpactText: {
    color: '#db2777',
    fontWeight: '800',
    fontSize: 12,
  },
  programButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#fce7f3',
  },
  programButtonText: {
    color: '#db2777',
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    borderWidth: 2,
    borderColor: '#db2777',
  },
  eventTag: {
    backgroundColor: '#db2777',
    color: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#831843',
    marginBottom: 20,
  },
  registerBtn: {
    backgroundColor: '#831843',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  donationLead: {
    textAlign: 'center',
    fontSize: 16,
    color: '#831843',
    marginBottom: 30,
    lineHeight: 24,
  },
  donationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  donationTierWrapper: {
    width: '30%',
  },
  donationTier: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#db2777',
  },
  tierAmt: {
    fontSize: 22,
    fontWeight: '900',
    color: '#db2777',
  },
  tierLabel: {
    fontSize: 10,
    color: '#831843',
    fontWeight: '700',
    marginTop: 5,
  },
  donateLargeBtn: {
    backgroundColor: '#db2777',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  donateLargeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fce7f3',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#831843',
  },
  sendBtn: {
    backgroundColor: '#831843',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  contactInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  contactText: {
    color: '#831843',
    fontWeight: '600',
    marginBottom: 15,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 30,
  },
  footer: {
    padding: 40,
    backgroundColor: '#831843',
    alignItems: 'center',
  },
  footerCopyright: {
    color: '#f9a8d4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default PinkCycleHome;
