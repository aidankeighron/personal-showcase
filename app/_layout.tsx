import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, FlatList, Image, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const MEDIA_KEY = '@MyPhotoGallery:mediaItems'; // A unique key for your app's data
const backgroundColor = '#1E1F22';

type Media = {
  id: string,
  uri: string,
  type: "image" | "video" | "livePhoto" | "pairedVideo" | undefined,
  width: number,
  height: number,
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const {width: screenWidth} = useWindowDimensions();

  const deleteItem = () => {
    const filteredItems = mediaItems.filter(i => i.id !== item.id);
    setMediaItems(filteredItems);
    saveMediaItems(filteredItems);
  }

  return (
    <TouchableOpacity style={[fullscreen ? styles.mediaFullScreen : styles.mediaContainer, {
      height: (screenWidth*(fullscreen ? 0.95 : 0.45)) * item.height/item.width,
    }]} 
    onLongPress={() => {
      setShowDeleteConfirm(true);
    }} 
    onPress={() => { setFullScreen(!fullscreen) }}>
      {item.type === 'image' ? (
        <Image source={{uri: item.uri}} style={styles.media} resizeMode='contain' />
      ) : (
        <Video source={{uri: item.uri}} isMuted={!fullscreen} resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true} isLooping style={styles.media} useNativeControls={false} />
      )}
      <Modal animationType="fade" transparent={true} visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalButtonContainer}>
              <Button title='Delete' onPress={() => {
                deleteItem();
                setShowDeleteConfirm(false);
              }} />
              <Button onPress={() => setShowDeleteConfirm(false)} title='Cancel' />
            </View>
          </View>
        </View>
      </Modal>
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
        // Videos are flipped?
        width: asset.type === 'video' ? asset.height : asset.width, 
        height: asset.type === 'video' ? asset.width : asset.height,
        id: asset.assetId || Date.now().toString() + Math.random().toString(),
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
    backgroundColor: backgroundColor,
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
    marginVertical: 10,
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
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 100,
  },
   centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'grey',
    borderRadius: 15,
    alignItems: 'center',
    padding: 30,
  },
});