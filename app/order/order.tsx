import { View, Text, useWindowDimensions } from 'react-native';
import Mapbox, { MapView, Camera, LocationPuck, PointAnnotation, Callout } from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
import { useOrderContext } from '~/providers/OrderProvider';
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function orderScreen() {
    const { width, height } = useWindowDimensions();
    const { activeOrder, driver } = useOrderContext();
    console.log('This is the active order', activeOrder);
  
    if (!activeOrder) {
      return <View className="flex-1"><Text>Loading active order...</Text></View>;
    }
  
    return (
      <View className="flex-1">
        <MapView style={{ height, width }}>
          <Camera followZoomLevel={14} followUserLocation />
          <LocationPuck puckBearingEnabled puckBearing="course" pulsing={{ isEnabled: true }} />

          {/* Restuarant Location */}
          {activeOrder.restaurant[0] && (
            <PointAnnotation
              id={`restaurant-${activeOrder.$id}`}
              coordinate={[
                activeOrder.restaurant[0].lng,
                activeOrder.restaurant[0].lat
              ]}
            >
              <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
                <Fontisto name="shopping-store" size={20} color="white" />
              </View>
              <Callout title={activeOrder.restaurant[0].name} />
            </PointAnnotation>
          )}
  
          {/* Driver Location */}
          {driver?.latitude && driver?.longitude && (
            <PointAnnotation
              id={`driver-${driver.$id}`}
              coordinate={[driver.longitude, driver.latitude]}
            >
              <View style={{ backgroundColor: 'blue', padding: 5, borderRadius: 20 }}>
                <Fontisto name="motorcycle" size={20} color="white" />
              </View>
              <Callout title="Driver's Location" />
            </PointAnnotation>
          )}
        </MapView>
      </View>
    );
}
