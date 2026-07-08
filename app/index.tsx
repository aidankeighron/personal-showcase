import AsyncStorage from '@react-native-async-storage/async-storage';
import MasonryList from '@react-native-seoul/masonry-list';
import * as ImagePicker from 'expo-image-picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Image, Modal, Platform,
  Pressable,
  SafeAreaView, StatusBar, StyleSheet,
  Text, TextInput,
  useWindowDimensions, View
} from 'react-native';
import AppButton from '../components/AppButton';
import MediaElement from '../components/element';
import { Media } from '../util/constants';
import { fontFamily, tokens } from '../util/tokens';

const MEDIA_KEY = '@MyPhotoGallery:mediaItems';

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
}
function FullscreenElement({item}: FullscreenElementProps) {
  const {width, height} = useWindowDimensions();
  const [rotate, setRotate] = useState<boolean>(false);

  useEffect(() => {
    if (rotate) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }, [rotate])

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }, [])

  const player = useVideoPlayer(item.uri, player => {
    player.loop = true;
    player.play();
  });

  switch (item.type) {
    case 'image':
      return <>
        <Image source={{uri: item.uri}} style={styles.media} resizeMode="contain" />
        <Text style={styles.fullscreenRotate} onPress={() => {setRotate(!rotate)}}>&#8635;</Text>
      </>
    default:
      return <>
        <View style={styles.media}>
          <VideoView style={[styles.media, {zIndex: tokens.zTray}]} player={player} contentFit='contain' nativeControls={false} />
        </View>
        <Text style={styles.fullscreenRotate} onPress={() => {setRotate(!rotate)}}>&#8635;</Text>
        <View style={{zIndex: tokens.zModal, width, height, position: 'absolute'}}></View>
      </>
  }
};

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
        <AppButton onPress={() => setShowWebsite(true)} title='Website' />
        <AppButton onPress={pickMedia} title='Image/Video' />
      </View>
      <MasonryList data={mediaItems} numColumns={2} keyExtractor={(item) => item.uri}
        contentContainerStyle={styles.gridContainer} ListFooterComponent={<View style={{height: 40}}></View>}
        renderItem={({item, i}) => <MediaElement index={i} item={item as Media} mediaItems={mediaItems}
          setMediaItems={setMediaItems} setFullscreenItem={setFullscreenItem} saveMediaItems={saveMediaItems} />}
      />
      {fullscreenItem && (
        <Pressable onPress={() => setFullscreenItem(null)} style={styles.fullScreenContainer}>
          <FullscreenElement item={fullscreenItem} />
        </Pressable>
      )}
      <Modal animationType="fade" transparent={true} visible={showWebsite}
        onRequestClose={() => setShowWebsite(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.websiteInput} value={website} onChangeText={setWebsite} />
            <View style={styles.modalButtonContainer}>
              <AppButton title='Add' onPress={() => {
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
              <AppButton onPress={() => setShowWebsite(false)} title='Cancel' variant='secondary' />
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
    backgroundColor: tokens.background,
  },
  gridContainer: {
    width: '100%',
    marginVertical: tokens.space6,
  },
  mediaContainer: {
    margin: tokens.space3,
    borderRadius: tokens.radiusSm,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: tokens.zModal,
  },
  fullscreenRotate: {
    position: 'absolute',
    top: tokens.space6,
    left: tokens.space6,
    paddingBottom: tokens.space6,
    height: tokens.space13,
    width: tokens.space13,
    borderRadius: tokens.radiusLg,
    backgroundColor: tokens.altBackgroundNeutral,
    fontSize: tokens.fontSizeXl,
    fontFamily,
    color: tokens.foreground,
    zIndex: tokens.zTooltipDesc,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: tokens.space11,
  },
  websiteInput: {
    color: tokens.foreground,
    backgroundColor: tokens.altBackgroundNeutral,
    width: 200,
    borderRadius: tokens.radiusLg,
    marginBottom: tokens.space8,
    fontSize: tokens.fontSizeMd,
    fontFamily,
    borderWidth: 1,
    borderColor: tokens.foreground,
    paddingHorizontal: tokens.space5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: tokens.background,
    borderRadius: tokens.radiusLg,
    alignItems: 'center',
    padding: tokens.space11,
    borderWidth: 2,
    borderColor: tokens.foreground,
  },
});
