import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import * as ImagePicker from 'expo-image-picker';
import { Router, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Button, Image, Modal, Platform,
  Pressable,
  SafeAreaView, StatusBar, StyleSheet,
  Text, TextInput,
  useWindowDimensions, View
} from 'react-native';
import MediaElement from '../components/element';
import { backgroundColor, Media } from '../util/constants';

const MEDIA_KEY = '@MyPhotoGallery:mediaItems'; // A unique key for your app's data

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

type FullscreenElementProps = {
  item: Media,
  setFullscreenItem: React.Dispatch<React.SetStateAction<Media | null>>,
  router: Router,
}
function FullscreenElement({item, setFullscreenItem, router}: FullscreenElementProps) {
  const {width, height} = useWindowDimensions();
  const [rotate, setRotate] = useState<boolean>(false);
  
  const player = useVideoPlayer(item.uri, player => {
    player.loop = true;
    player.play();
  });

  switch (item.type) {
    case 'image':
      return <>
        <Image source={{uri: item.uri}} style={[styles.media, rotate && {transform: [{ rotate: '90deg' }]}]} resizeMode="contain" />
        <Text style={styles.fullscreenRotate} onPress={() => {setRotate(!rotate)}}>&#8635;</Text>
      </>
    case 'website':
      router.push({pathname: '/webview', params: {uri: item.uri}});
      setFullscreenItem(null);
      return <></>
    default:
      return <>
        <View style={[styles.media, rotate && {transform: [{ rotate: '90deg' }]}]}>
          <VideoView style={[styles.media, {zIndex: 50}]} player={player} contentFit='contain' nativeControls={false} />
        </View>
        <Text style={styles.fullscreenRotate} onPress={() => {setRotate(!rotate)}}>&#8635;</Text>
        <View style={{backgroundColor: 'transparent', zIndex: 100, width, height, position: 'absolute'}}></View>
      </> 
  }
};

export default function HomeScreen() {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [showWebsite, setShowWebsite] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>("");
  const [fullscreenItem, setFullscreenItem] = useState<Media | null>(null);
  const router = useRouter();

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
        width: asset.width, height: asset.height,
        rotation: (asset as any).rotation ?? 0,
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
        <Button onPress={pickMedia} color={'purple'} title='Image/Video' />
      </View>
      <MasonryList data={mediaItems} numColumns={2} keyExtractor={(item) => item.uri} 
        contentContainerStyle={styles.gridContainer} ListFooterComponent={<View style={{height: 40}}></View>}
        renderItem={({item, i}) => <MediaElement index={i} item={item as Media} mediaItems={mediaItems}
          setMediaItems={setMediaItems} setFullscreenItem={setFullscreenItem} saveMediaItems={saveMediaItems} />} 
      />
      {fullscreenItem && <Pressable onPress={() => {setFullscreenItem(null)}} style={styles.fullScreenContainer}>
        <FullscreenElement setFullscreenItem={setFullscreenItem} item={fullscreenItem} router={router} />
      </Pressable>}
      <Modal animationType="fade" transparent={true} visible={showWebsite}
        onRequestClose={() => setShowWebsite(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.websiteInput} value={website} onChangeText={setWebsite} />
            <View style={styles.modalButtonContainer}>
              <Button title='Add' onPress={() => {
                let websiteUri = website;
                if (!websiteUri.includes("http")) {
                  websiteUri = "https://" + websiteUri;
                }
                const newWebsite: Media = {
                  uri: websiteUri, type: 'website',
                  width: 100, 
                  height: 100,
                  rotation: 0,
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
    borderRadius: 5,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  fullScreenContainer: {
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenRotate: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingBottom: 10,
    height: 50,
    width: 50,
    borderRadius: 15,
    backgroundColor: 'grey',
    fontSize: 30,
    zIndex: 150,
    textAlign: 'center',
    textAlignVertical: 'center',
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