import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, FlatList, Image, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

const MEDIA_KEY = '@MyPhotoGallery:mediaItems'; // A unique key for your app's data

type Media = {
  uri: string;
  type: "image" | "video" | "livePhoto" | "pairedVideo" | undefined;
  width: number;
  height: number;
}

// Function to save your array of media item objects
async function saveMediaItems(items: Media[]) {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(MEDIA_KEY, jsonValue);
    console.log('media saved');
  } 
  catch (e) {
    console.error('Error saving media:', e);
  }
}

// Function to load your array of media item objects
async function loadMediaItems(): Promise<Media[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(MEDIA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } 
  catch (e) {
    console.error('Error loading media references:', e);
    return [];
  }
}

async function requestPermissions() {
  const {status: mediaLibraryStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  const {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();

  if (mediaLibraryStatus !== 'granted') {
    alert('Permission to access media library is required!');
    return false;
  }
  if (cameraStatus !== 'granted') {
    alert('Permission to access camera is required!');
    return false;
  }
  return true;
}

type MediaElementProps = {
  item: Media,
  mediaItems: Media[],
  setMediaItems: any,
}

function MediaElement({item, mediaItems, setMediaItems}: MediaElementProps) {
  const [fullscreen, setFullScreen] = useState<boolean>(false);

  return (
    <TouchableOpacity style={fullscreen ? styles.mediaFullScreen : styles.mediaContainer} onLongPress={() => {
      const filteredItems = mediaItems.filter(i => i.uri !== item.uri);
      setMediaItems(filteredItems);
      saveMediaItems(filteredItems);
    }} onPress={() => { setFullScreen(!fullscreen) }}>
      {item.type === 'image' ? (
        <Image source={{uri: item.uri}} style={styles.media} resizeMode='center' />
      ) : (
        <Video source={{uri: item.uri}} isMuted={!fullscreen} resizeMode={ResizeMode.COVER}
          shouldPlay={true} isLooping style={styles.media} useNativeControls={fullscreen} />
      )}
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);

  useEffect(() => {
    const fetchStoredMedia = async () => {
      const stored = await loadMediaItems();
      setMediaItems(stored);
    };
    fetchStoredMedia();
  }, []);

  const pickMedia = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true, quality: 1,
    });

    if (!result.canceled) {
      const selectedAssets = result.assets.map(asset => ({
        uri: asset.uri, type: asset.type,
        width: asset.width, height: asset.height,
      }));
      console.log('Selected media assets:', selectedAssets);
      const updatedMediaItems = [...mediaItems, ...selectedAssets];
      setMediaItems(updatedMediaItems);
      saveMediaItems(updatedMediaItems);
    }
  };

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <Button onPress={pickMedia} color={'purple'} title='Pick' />
      <FlatList data={mediaItems} numColumns={2} keyExtractor={(item) => item.uri} contentContainerStyle={styles.gridContainer}
        renderItem={({item}) => <MediaElement item={item} mediaItems={mediaItems} setMediaItems={setMediaItems} />} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: '#1E1F22',
  },
  gridContainer: {
    height: '100%',
    width: '100%',
    marginVertical: 10,
  },
  mediaContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: '2.5%',
    width: '45%',
    zIndex: 99,
  },
  mediaFullScreen: {
    borderRadius: 5,
    overflow: 'hidden',
    width: '95%',
    marginHorizontal: '2.5%',
    position: 'absolute',
    zIndex: 100,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});