// Google MAP карта

import React, { useState, useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, View, Platform, Keyboard, Alert } from 'react-native'
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import MapView from 'react-native-map-clustering'
import { COLORS } from '../colors'
import MarkerItem from './MarkerItem'
import { n } from '../utils/normalize'

export default function Map({ refDetail, refList, setModal, modal, search, setSearch, setRefDetail }) {
    const mapRef = useRef()
    const [mapRegion, setMapRegion] = useState({
        latitude: 41.311081,
        longitude: 69.240562,
        latitudeDelta: 0.0700,
        longitudeDelta: 0.0450,
    })

    async function getLocation() {
        const { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
        }
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })

        if (location) {
            setMapRegion({ ...location.coords, latitudeDelta: 0.0850, longitudeDelta: 0.0450 })
        }
    }

    useEffect(() => {
        getLocation()
        if (refDetail) {
            const region = {
                latitude: refDetail.long,
                longitude: refDetail.lat,
                latitudeDelta: 0.005,
                longitudeDelta: 0.0025,
            }
            mapRef.current.animateToRegion(region, 1000)
            setModal(false)
            setSearch('')
            Keyboard.dismiss()
        }
    }, [refDetail, modal, search])

    if (!refList.response) {
        return <ActivityIndicator size="large" color="#223263" />
    }

    return (
        <View style={styles.mainMap}>
            <ActivityIndicator
                size="large"
                color="black"
                style={[styles.indicator, !refList.loading ? { opacity: 0 } : null]} />

            <MapView
                ref={mapRef}
                provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={mapRegion}
                showsUserLocation
                clusterColor="#F18C44"
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                showsMyLocationButton>
                {refList.response.results.map((item) => (
                    <MarkerItem
                        key={item.id}
                        tool={refDetail?.id === item.id}
                        item={item}
                        setRefDetail={setRefDetail}
                        coordinate={{ latitude: item.long, longitude: item.lat }} />
                ))}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainMap: {
        borderTopStartRadius: n(30),
        borderTopEndRadius: n(30),
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        height: '100%',
    },
    indicator: {
        width: n(160),
        height: n(110),
        backgroundColor: COLORS.WHITE,
        position: 'absolute',
        top: '40%',
        left: '30%',
        zIndex: 1,
        opacity: 0.8,
        borderRadius: n(15),
    },
})
