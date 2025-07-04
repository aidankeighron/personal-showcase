import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Button, Image, Linking, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

const MEDIA_KEY = '@MyPhotoGallery:mediaItems'; // A unique key for your app's data
const backgroundColor = '#1E1F22';

type Media = {
  id: string,
  uri: string,
  type: "image" | "video" | "livePhoto" | "pairedVideo" | "website" | undefined,
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

  const displayMedia = () => {
    switch (item.type) {
      case 'website':
        return <WebView source={{uri: item.uri}} style={styles.media} />
      case 'image':
        return <Image source={{uri: item.uri}} style={styles.media} resizeMode='contain' />
      default:
        return <Video source={{uri: item.uri}} isMuted={!fullscreen} resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true} isLooping style={styles.media} useNativeControls={false} />
    }
  }

  return (
    <TouchableOpacity style={[fullscreen ? styles.mediaFullScreen : styles.mediaContainer, {
      height: (screenWidth*(fullscreen ? 0.95 : 0.5)) * item.height/item.width,
    }]} 
    onLongPress={() => {
      setShowDeleteConfirm(true);
    }} 
    onPress={() => {
      if (item.type === 'website') {
        // TODO web view
        Linking.openURL(item.uri);
      }
      else {
        setFullScreen(!fullscreen) 
      }
    }}>
      {displayMedia()}
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
  const [showWebsite, setShowWebsite] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>("");

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
      const selectedAssets: Media[] = result.assets.map(asset => ({
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
      <View style={[styles.modalButtonContainer, {justifyContent: 'center'}]}>
        <Button onPress={() => setShowWebsite(true)} color={'purple'} title='Website' />
        <Button onPress={pickMedia} color={'purple'} title='Image' />
      </View>
      <MasonryList data={mediaItems} numColumns={2} keyExtractor={(item) => item.uri} 
        contentContainerStyle={styles.gridContainer} ListFooterComponent={<View style={{height: 40}}></View>}
        renderItem={({item}) => <MediaElement item={item as Media} mediaItems={mediaItems} setMediaItems={setMediaItems} />} 
      />
      <Modal animationType="fade" transparent={true} visible={showWebsite}
        onRequestClose={() => setShowWebsite(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.websiteInput} value={website} onChangeText={setWebsite} />
            <View style={styles.modalButtonContainer}>
              <Button title='Add' onPress={() => {
                const newWebsite: Media = {
                  uri: website, type: 'website',
                  width: 100, 
                  height: 100,
                  id: Date.now().toString() + Math.random().toString(),
                };
                console.log('Added website:', newWebsite);
                const updatedMediaItems = [...mediaItems, newWebsite];
                setMediaItems(updatedMediaItems);
                saveMediaItems(updatedMediaItems);
                setShowWebsite(false);
              }} />
              <Button onPress={() => setShowWebsite(false)} title='Cancel' />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: backgroundColor,
  },
  gridContainer: {
    width: '100%',
    marginVertical: 10,
  },
  mediaContainer: {
  },
  mediaFullScreen: {
    borderRadius: 5,
    overflow: 'hidden',
    width: '95%',
    marginHorizontal: '2.5%',
    position: 'absolute',
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
  websiteInput: {
    color: 'black',
    backgroundColor: 'white',
    width: 200,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 18,
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