import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';
import { Button, Image, Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Media } from '../util/constants';


type MediaElementProps = {
  index: number,
  item: Media,
  mediaItems: Media[],
  setMediaItems: React.Dispatch<React.SetStateAction<Media[]>>,
  saveMediaItems: {(items: Media[]): Promise<void>},
  setFullscreenItem: React.Dispatch<React.SetStateAction<Media | null>>,
}

export default function MediaElement({index, item, mediaItems, setMediaItems, saveMediaItems, setFullscreenItem}: MediaElementProps) {
  const [showElementModal, setShowElementModal] = useState<boolean>(false);
  const [order, setOrder] = useState<string>(index.toString());
  const {width: screenWidth} = useWindowDimensions();
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  
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
    const cardWidth = 100; // Your desired card width
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
            <Text style={{position: 'absolute', color: 'black', backgroundColor: 'white', paddingHorizontal: 2, fontSize: 10}}>Video</Text>
          </>
          : <View style={[styles.media, {backgroundColor: 'grey'}]}></View>)
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
    <Pressable style={[styles.mediaContainer, {height: (screenWidth/2 - 10) * itemHeight/itemWidth}]}
    onLongPress={() => { setShowElementModal(true) }} onPress={() => { setFullscreenItem(item) }}>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
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