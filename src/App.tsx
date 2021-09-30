import React, {useState,useEffect} from 'react';
import {SafeAreaView, Alert, FlatList, Text, View, Platform } from 'react-native';
import WeatherView from './components/WeatherView';
import styled from 'styled-components/native'
import geoLocation from 'react-native-geolocation-service';
const Container = styled.View`
    flex:1;
    background-color : #EEE;
`;
const WeatherContainer = styled.FlatList``;

const LoadingView = styled.View`
    flex: 1;
    justify-content : center;
    align-items : center;
`;
const LoadingSpinner = styled.ActivityIndicator`
    margin-bottom : 16px;
    margin-top : 700px;
`;
const LoadingLabel = styled.Text`
    font-size : 16px;
`;

const WeahterItemContainer = styled.View`
    height : 100%;
    justify-content : center;
    align-items : center;    
`;
const WeatherLabel = styled.Text`
    margin-bottom : 16px;
    font-size : 24px;
    font-weight : bold;    
`;
const Temperature = styled.Text`
    font-size : 16px;
`;

const API_KEY = "5ce4e5d5eb8ea1ce0966a373f809c7fd";
type WeatherData = {
    temperature? : string;
    weather? : string;
    isLoading : boolean;
}

const App = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherData>({
    temperature : undefined,
    weather : undefined,   
    isLoading : false
});

const getCurrentWeather = ()=>{
    // 1. init Setting
    setWeatherInfo({isLoading : false})
    
    // 2. get the geoLocation
    geoLocation.getCurrentPosition(
        (position) => {
            const {longitude, latitude} = position.coords;
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            ).then(res => res.json())
            .then(json => {
                setWeatherInfo({
                    temperature : JSON.stringify(json.main.temp),
                    weather  : JSON.stringify(json.weather[0].main),
                    isLoading : true,
                })    
            })
            .catch(error => {
                setWeatherInfo({
                    isLoading : true
                })
                setTimeout(()=>Alert.alert("날씨 정보를 가져오는데 실패하였습니다."),500)
            })
        },
        (error) => {
            setWeatherInfo({
                isLoading: true
            })
            setTimeout(()=>Alert.alert("위치 정보를 가져오는데 실패하였습니다."),500)
        }            
    )
}  
useEffect(()=>{
  // if(Platform.OS === "ios"){
  //   geoLocation.requestAuthorization("always")
  // }
    getCurrentWeather();        
},[])   
let data : Array<WeatherData> = [];
const {weather, temperature} =  weatherInfo;
if(weather && temperature){
  data.push(weatherInfo)
}
  return (
    <SafeAreaView>
      {
        !weatherInfo.isLoading 
        ?
        <LoadingView>
            <LoadingSpinner size = "large" color = "#1976D2"/>
            <LoadingLabel>Loading... </LoadingLabel>
        </LoadingView>
        : 
        <WeahterItemContainer>                    
          <WeatherLabel>{weatherInfo.weather}</WeatherLabel>                    
          <Temperature>{weatherInfo.temperature}</Temperature>
        </WeahterItemContainer>
      }
    </SafeAreaView>
  );
};

export default App;
