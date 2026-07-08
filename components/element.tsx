import * as VideoThumbnails from 'expo-video-thumbnails';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import AppButton from './AppButton';
import { Media } from '../util/constants';
import { fontFamily, tokens } from '../util/tokens';


type MediaElementProps = {
  index: number,
  item: Media,
  mediaItems: Media[],
  setMediaItems: React.Dispatch<React.SetStateAction<Media[]>>,
  saveMediaItems: (items: Media[]) => Promise<void>,
  setFullscreenItem: React.Dispatch<React.SetStateAction<Media | null>>,
}

export default function MediaElement({index, item, mediaItems, setMediaItems, saveMediaItems, setFullscreenItem}: MediaElementProps) {
  const [showElementModal, setShowElementModal] = useState<boolean>(false);
  const [order, setOrder] = useState<string>(index.toString());
  const {width: screenWidth} = useWindowDimensions();
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const scale = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const itemWidth = item.rotation === 0 ? item.width : item.height;
  const itemHeight = item.rotation === 0 ? item.height : item.width;

  useEffect(() => {
    VideoThumbnails.getThumbnailAsync(item.uri, { time: 100 }).then(result => {
      setVideoThumbnail(result.uri);
    });
  }, [item.uri]);

  const deleteItem = () => {
    const filteredItems = mediaItems.filter(i => i.id !== item.id);
    setMediaItems(filteredItems);
    saveMediaItems(filteredItems);
  }

  const displayMedia = () => {
    const cardWidth = 100;
    const initialScale = cardWidth / screenWidth;
    const injectedJavaScript = `
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=${screenWidth}, initial-scale=${initialScale}, maximum-scale=${initialScale}, user-scalable=no');
      document.getElementsByTagName('head')[0].appendChild(meta);
      true; // Important for Android to ensure the script runs
    `;

    switch (item.type) {
      case 'website':
        return <WebView source={{uri: item.uri}} style={styles.media} pointerEvents='none'
        injectedJavaScript={injectedJavaScript} />
      case 'image':
        return <Image source={{uri: item.uri}} style={styles.media} resizeMode='contain' />
      default:
        return (videoThumbnail ?
          <>
            <Image source={{uri: videoThumbnail}} style={styles.media} resizeMode='contain' />
            <Text style={{position: 'absolute', color: tokens.foreground, backgroundColor: tokens.altBackgroundNeutral, paddingHorizontal: tokens.space1, fontSize: tokens.fontSizeXs, fontFamily}}>Video</Text>
          </>
          : <View style={[styles.media, {backgroundColor: tokens.altBackgroundNeutral}]}></View>)
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
    }
    else {
      alert('Please enter a valid index within the current range.');
    }
  };

  return (
    <Pressable
      style={[styles.mediaContainer, {height: (screenWidth/2 - 10) * itemHeight/itemWidth}]}
      onLongPress={() => { setShowElementModal(true) }}
      onPress={() => {
        if (item.type === 'website') {
          router.push({ pathname: '/webview', params: { uri: item.uri } });
        } else {
          setFullscreenItem(item);
        }
      }}
      onPressIn={() => Animated.timing(scale, { toValue: 0.95, duration: 125, useNativeDriver: true }).start()}
      onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 125, useNativeDriver: true }).start()}>
      <Animated.View style={{flex: 1, transform: [{scale}]}}>
        {displayMedia()}
      </Animated.View>
      <Modal animationType="fade" transparent={true} visible={showElementModal}
        onRequestClose={() => setShowElementModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput value={order} onChangeText={setOrder} style={styles.websiteInput}  />
            <View style={styles.modalButtonContainer}>
              <AppButton title='Delete' variant='secondary' onPress={() => {
                deleteItem();
                setShowElementModal(false);
              }} />
              <AppButton title='Reorder' onPress={() => {
                handleReorder();
                setShowElementModal(false);
              }} />
              <AppButton onPress={() => { setShowElementModal(false) }} title='Cancel' variant='secondary' />
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    margin: tokens.space3,
    borderRadius: tokens.radiusSm,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.radiusSm,
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
