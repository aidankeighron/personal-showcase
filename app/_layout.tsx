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
  index: number,
  item: Media,
  mediaItems: Media[],
  setMediaItems: React.Dispatch<React.SetStateAction<Media[]>>,
  setFullscreenItem: React.Dispatch<React.SetStateAction<Media | null>>,
}

function MediaElement({index, item, mediaItems, setMediaItems, setFullscreenItem}: MediaElementProps) {
  const [showElementModal, setShowElementModal] = useState<boolean>(false);
  const [order, setOrder] = useState<string>(index.toString());
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
        return <Video source={{uri: item.uri}} isMuted={true} resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true} isLooping style={styles.media} useNativeControls={false} />
    }
  }

  const handleReorder = () => {
    const newIndex = parseInt(order, 10);
    if (!isNaN(newIndex)) {
      setMediaItems((currentItems) => {
        const itemToMove = currentItems.find((i) => i.id === item.id);
        if (!itemToMove) {
          return currentItems;
        }

        const filteredItems = currentItems.filter((i) => i.id !== item.id);
        const targetIndex = Math.min(Math.max(0, newIndex), filteredItems.length);

        const reorderedItems = [
          ...filteredItems.slice(0, targetIndex),
          itemToMove,
          ...filteredItems.slice(targetIndex),
        ];

        saveMediaItems(reorderedItems);
        return reorderedItems;
      });
      setShowElementModal(false);
    } else {
      alert('Please enter a valid index within the current range.');
    }
  };

  return (
    <TouchableOpacity style={[styles.mediaContainer, {
      height: (screenWidth/2 - 10) * item.height/item.width,
    }]} 
    onLongPress={() => {
      setShowElementModal(true);
    }} 
    onPress={() => {
      if (item.type === 'website') {
        // TODO web view
        Linking.openURL(item.uri);
      }
      else {
        setFullscreenItem(item);
      }
    }}>
      {displayMedia()}
      <Modal animationType="fade" transparent={true} visible={showElementModal}
        onRequestClose={() => setShowElementModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput value={order} onChangeText={setOrder} style={styles.websiteInput}  />
            <View style={styles.modalButtonContainer}>
              <Button title='Delete' onPress={() => {
                deleteItem();
                setShowElementModal(false);
              }} />
              <Button title='Reorder' onPress={() => {
                handleReorder();
                setShowElementModal(false);
              }} />
              <Button onPress={() => { setShowElementModal(false) }} title='Cancel' />
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
  const [fullscreenItem, setFullscreenItem] = useState<Media | null>(null);

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

  const renderFullscreen = (item: Media) => {
    switch (item.type) {
      case 'image':
        return <Image source={{uri: item.uri}} style={styles.media} resizeMode="contain" />
      case 'website':
        return <></>
      default:
        return <Video source={{uri: item.uri}} isMuted={false} resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true} isLooping useNativeControls style={styles.media} />
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
        renderItem={({item, i}) => <MediaElement index={i} item={item as Media} mediaItems={mediaItems}
          setMediaItems={setMediaItems} setFullscreenItem={setFullscreenItem} />} 
      />
      {fullscreenItem && <TouchableOpacity onPress={() => setFullscreenItem(null)} style={styles.fullScreenContainer}>
        {renderFullscreen(fullscreenItem)}
      </TouchableOpacity>}
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
    margin: 5,
    // TODO border radius
  },
  media: {
    width: '100%',
    height: '100%',
  },
  fullScreenContainer: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 30,
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