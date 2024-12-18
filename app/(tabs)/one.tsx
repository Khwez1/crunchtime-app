import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getRestaurants, getCategories } from '~/lib/appwrite';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [fontsLoaded] = useFonts({
    Venn: require('../../assets/fonts/Venn.ttf'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurants();
        const categoryData = await getCategories();

        if (restaurantData && Array.isArray(restaurantData)) {
          // Format restaurants, assign 'Uncategorized' for those without a category
          const formattedRestaurants = restaurantData.map((item) => ({
            id: item.$id || '',
            name: item.name || 'Unknown Restaurant',
            image: item.image || 'https://via.placeholder.com/300',
            rating: item.rating || '4.0',
            deliveryTime: item.deliveryTime || '30 min',
            category: item.category || 'Uncategorized', // Default category if no category provided
          }));
          setRestaurants(formattedRestaurants);

          // Grouping restaurants by category
          const groupedRestaurants = {
            'All': formattedRestaurants  // All restaurants go here
          };

          if (categoryData && Array.isArray(categoryData)) {
            const formattedCategories = categoryData.map((item) => ({
              id: item.$id || '',
              name: item.name || 'Unnamed Category',
              icon: item.icon || 'ios-restaurant',
            }));
            setCategories(formattedCategories);

            formattedCategories.forEach(category => {
              groupedRestaurants[category.name] = formattedRestaurants.filter(r => 
                r.category === category.name || 
                (r.category === 'Uncategorized' && category.name !== 'All')
              );
            });

            // Ensure 'Uncategorized' is always present if there are uncategorized restaurants
            if (formattedRestaurants.some(r => r.category === 'Uncategorized')) {
              groupedRestaurants['Uncategorized'] = formattedRestaurants.filter(r => r.category === 'Uncategorized');
            }
          }

          const sections = Object.keys(groupedRestaurants).map(category => ({
            title: category,
            data: groupedRestaurants[category]
          }));

          setSections(sections);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!fontsLoaded) return null;

  const RestaurantItem = ({ name, image, rating, deliveryTime, id }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/restaurantDetails/${id}`)}
      style={styles.restaurantItemHorizontal}
    >
      <Image source={{ uri: image }} style={styles.restaurantImageHorizontal} />
      <View style={styles.restaurantDetailsHorizontal}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.restaurantInfo}>Rating: {rating}</Text>
        <Text style={styles.restaurantInfo}>Delivery Time: {deliveryTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const RestaurantSection = ({ title, data }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          onPress={() => handleSeeAll(title)}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantItem
            name={item.name}
            image={item.image}
            rating={item.rating}
            deliveryTime={item.deliveryTime}
            id={item.id}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionList}
      />
    </View>
  );

  const handleSeeAll = (categoryName) => {
    // Here you would navigate to a new screen or modal showing all items for this category
    console.log('See all for category:', categoryName);
  };

  const CategoryItem = ({ category }) => (
    <TouchableOpacity 
      onPress={() => {
        if(category.name === 'All') {
          setActiveCategory({ name: 'All' });
        } else {
          setActiveCategory(category);
        }
      }}
      style={[styles.categoryItem, activeCategory && (activeCategory.name === category.name || (activeCategory.name === 'All' && category.name === 'All')) ? styles.activeCategory : null]}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={category.icon} size={30} color="#000000" />
      </View>
      <Text style={styles.categoryText}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#FFFFFF', '#E0E0E0']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentWrapper}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="notifications-outline" size={24} color="#000000" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="cart-outline" size={24} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#000000" style={styles.searchIcon} />
              <TextInput
                placeholder="Search for restaurants..."
                placeholderTextColor="#000000"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Categories Carousel with Icons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              <CategoryItem key="all" category={{id: 'all', name: 'All', icon: 'ios-list'}} />
              {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </ScrollView>

            {/* Restaurants Section */}
            <FlatList
              data={sections}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => <RestaurantSection title={item.title} data={item.data} />}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingVertical: 20 },
  contentWrapper: { paddingHorizontal: 15, width: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Venn',
    fontSize: 16,
    color: '#000',
  },
  categoriesScroll: {
    marginBottom: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
  },
  activeCategory: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Venn',
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  restaurantsTitle: {
    fontFamily: 'Venn',
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
  },
  restaurantList: {
    paddingBottom: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },

  restaurantItemHorizontal: {
    flexDirection: 'row',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    width: 300, // Adjust width as needed for your design
    justifyContent: 'space-between'
  },
  
  restaurantImageHorizontal: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },

  restaurantDetailsHorizontal: {
    flex: 1,
    marginLeft: 10,
  },

  sectionContainer: {
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  sectionList: {
    paddingRight: 15,
  },

  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontFamily: 'Venn',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    fontFamily: 'Venn',
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
});