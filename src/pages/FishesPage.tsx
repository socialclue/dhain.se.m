import React, { Component } from 'react';
import { connect } from 'react-redux';
import hash from 'object-hash';
import { RootState, selectors, actions } from '../store';
import iStorage from "istorage";
import {reactLocalStorage} from 'reactjs-localstorage';
import geolocation from 'geolocation';
import FishList from '../components/FishList';
import FishListFilter from '../components/FishListFilter';
import {Plugins} from '@capacitor/core';
const {Geolocation} = Plugins;
import {Location} from '../store/locations/types';
import {FistGoingToTrip} from '../store/fishes/types';
import { withRouter, RouteComponentProps } from "react-router";
import { IonTextarea, IonCard, IonCardContent, IonRadioGroup, IonRadio, IonItem, IonLabel , IonList, IonListHeader, IonSelect, IonSelectOption, IonModal, IonInput, IonLoading, IonToast, IonIcon, IonHeader, IonToolbar, IonButtons, IonMenuButton,
    IonSegment, IonSegmentButton, IonButton, IonSearchbar, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabList, IonFabButton, IonAlert, IonText } from '@ionic/react';
import './FishesPage.css';

type Props =  RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  segment: string,
  isRefreshing: boolean,
  showLoading: boolean,
  showFilterModal: boolean,
  loadingMessage: string,
  showModal: boolean,
  rating: boolean,
  feedback: boolean,
  remarks: boolean,
  ratingValue: string,
  feedbackValue: string,
  remarksValue: string,
  name:string,
  file:string,
  latitude:number,
  longitude:number
}

class FishesPage extends Component<Props, State> {
  ionRefresherRef: React.RefObject<HTMLIonRefresherElement>
  ionFabRef: React.RefObject<HTMLIonFabElement>
  state = {
    segment: 'all',
    isRefreshing: false,
    showLoading: false,
    showFilterModal: false,
    loadingMessage: '',
    showModal: false,
    rating: false,
    feedback: false,
    remarks: false,
    ratingValue: '',
    feedbackValue: '',
    remarksValue: '',
    name:'',
    file:'',
    items:[{
      'name': '',
      'id':'',
      'timestamp': '',
      'rating' : '',
      'feedback' : '',
      'remarks'  : '',
      'file': '',
      'geoLocation':0
    }],
    latitude:0,
    longitude:0
  }

  constructor(props: Props) {
    super(props);

    props.updateFishes();
    props.updateBranches();
    this.getMyPosition();



    this.ionRefresherRef = React.createRef<HTMLIonRefresherElement>();
    this.ionFabRef = React.createRef<HTMLIonFabElement>();
  }

  componentDidMount = () => {
    Object.keys(window.localStorage).map((item,i) => {
      this.state.items.push(iStorage.getItem(item));
    });
  }

getMyPosition = () => {
      if (Geolocation) {

          Geolocation.getCurrentPosition().then(coordinates => {
            this.setState({latitude:coordinates.coords.latitude});
            this.setState({longitude:coordinates.coords.longitude});
          });
      }
  }

  presentFilter = () => {
    this.setState(() => ({
      showFilterModal: true
    }));
  }

  updateSearchTerm = (e: CustomEvent) => {
    this.props.setSearchText(e.detail.value);
  }

  openSocial = (network: string) => {
    this.setState(() => ({
      loadingMessage: `Posting to ${network}`,
      showLoading: true
    }));

    setTimeout(() => {
      this.setState(() => ({ showLoading: false}))
    }, (Math.random() * 1000) + 500);

    if (this.ionFabRef.current) {
      this.ionFabRef.current.close();
    }
  }


  updateSegment = (e: CustomEvent) => {
    this.setState((prevState) => ({
      ...prevState,
      segment: e.detail.value
    }));
  }

  doRefresh = () => {
    setTimeout(() => {
      this.setState(() => ({ 'isRefreshing': true }));
      if (this.ionRefresherRef.current) {
        this.ionRefresherRef.current.complete();
      }
    }, 500);
  }

  render() {
    return (
      <>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>

            <IonSegment onIonChange={this.updateSegment}>
              <IonSegmentButton value="all" checked={this.state.segment === 'all'}>
                All
              </IonSegmentButton>
              <IonSegmentButton value="favorites" checked={this.state.segment === 'favorites'}>
                Favorites
              </IonSegmentButton>
            </IonSegment>

            <IonButtons slot="end">
              <IonButton onClick={this.presentFilter}>
                <IonIcon name="options" slot="icon-only"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>

          <IonToolbar color="primary">
            <IonSearchbar
              placeholder="Search"
              onIonChange={(e: CustomEvent) => this.props.setSearchText(e.detail.value)}
            >
            </IonSearchbar>
          </IonToolbar>
        </IonHeader>

      <IonContent>
    {this.state.items.map((item,i)=>{
      if(i>0)
      return (
        <IonCard key={i}>
          <IonCardContent>
            {item.name}
          </IonCardContent>
        </IonCard>
      )
    })}
  </IonContent>
        <IonModal
        isOpen={this.state.showModal}
        onDidDismiss={() => this.setState(() => ({ showModal: false }))}>
        <IonButton onClick={() => this.setState(() => ({ showModal: false }))}>
          Close Modal
        </IonButton>
          <IonText color="primary" text-center>
          <h2>Add details</h2>
        </IonText>
          <IonItem text-center>
            <IonLabel position="fixed">Name</IonLabel>
            <input value={this.state.name} placeholder="Enter Your Name" onChange={(e)=>{this.setState({name:e.target.value})}}/>
          </IonItem>

          <IonItem text-center>
            <IonLabel position="fixed">File</IonLabel>
              <input type="file" value={this.state.file} onChange={(e)=>{this.setState({file:e.target.value});  console.log('FILES : ', e.target.files );}}/>
          </IonItem>

            <IonList>
             <IonRadioGroup>
               <IonListHeader>
                 <IonLabel>Select Review</IonLabel>
               </IonListHeader>

               <IonItem>
                 <IonLabel>Rating</IonLabel>
                 <IonRadio slot="start" value="Rating" onClick={()=>{this.setState({rating:true, feedback:false, remarks:false})}}></IonRadio>
               </IonItem>

               <IonItem>
                 <IonLabel>Feedback</IonLabel>
                 <IonRadio slot="start" value="Feedback" onClick={()=>{this.setState({feedback:true, rating:false, remarks:false})}}></IonRadio>
               </IonItem>

               <IonItem>
                 <IonLabel>Remarks : </IonLabel>
                 <IonRadio slot="start" value="Remarks" onClick={()=>{this.setState({remarks:true, feedback:false, rating:false,})}}></IonRadio>
               </IonItem>
             </IonRadioGroup>
           </IonList>

           {this.state.rating?     <IonList>
                <IonRadioGroup>
                  <IonListHeader>
                    <IonLabel>Select Rating</IonLabel>
                  </IonListHeader>

                  <IonItem>
                    <IonLabel>1</IonLabel>
                    <IonRadio slot="start" value="1" onClick={()=>{this.setState({ratingValue:'1'})}}></IonRadio>
                  </IonItem>

                  <IonItem>
                    <IonLabel>2</IonLabel>
                    <IonRadio slot="start" value="2" onClick={()=>{this.setState({ratingValue:'2'})}}></IonRadio>
                  </IonItem>

                  <IonItem>
                    <IonLabel>3</IonLabel>
                    <IonRadio slot="start" value="3" onClick={()=>{this.setState({ratingValue:'3'})}}></IonRadio>
                  </IonItem>

                  <IonItem>
                    <IonLabel>4</IonLabel>
                    <IonRadio slot="start" value="3" onClick={()=>{this.setState({ratingValue:'4'})}}></IonRadio>
                  </IonItem>

                  <IonItem>
                    <IonLabel>5</IonLabel>
                    <IonRadio slot="start" value="5" onClick={()=>{this.setState({ratingValue:'5'})}}></IonRadio>
                  </IonItem>
                </IonRadioGroup>
              </IonList>:''}

          {this.state.feedback? <IonList>
               <IonRadioGroup>
                 <IonListHeader>
                   <IonLabel>Select Feedback</IonLabel>
                 </IonListHeader>

                 <IonItem>
                   <IonLabel>Good</IonLabel>
                   <IonRadio slot="start" value="Good" onClick={()=>{this.setState({feedbackValue:'Good'})}}></IonRadio>
                 </IonItem>

                 <IonItem>
                   <IonLabel>Better</IonLabel>
                   <IonRadio slot="start" value="Better" onClick={()=>{this.setState({feedbackValue:'Better'})}}></IonRadio>
                 </IonItem>

                 <IonItem>
                   <IonLabel>Best</IonLabel>
                   <IonRadio slot="start" value="Best" onClick={()=>{this.setState({feedbackValue:'Best'})}}></IonRadio>
                 </IonItem>
               </IonRadioGroup>
             </IonList>:''}

         {this.state.remarks? <IonItem>
          <IonLabel>Remarks</IonLabel>
          <textarea value={this.state.remarksValue} onChange={(e)=>{this.setState({remarksValue:e.target.value})}}></textarea>
        </IonItem>:''}

          <IonButton onClick={() => {this.setState(() => ({ showModal: false }));


          // We get the data as Array
           let id = hash(this.state.name + new Date());

           //getCurrentPosition
           this.getMyPosition();

           console.log(this.state.latitude,this.state.longitude)

           let item = {
            'name': this.state.name,
            'id': hash(this.state.name + new Date()),
            'timestamp': new Date(),
            'rating' : this.state.ratingValue,
            'feedback' : this.state.feedbackValue,
            'remarks'  : this.state.remarksValue,
            'file': this.state.file,
            'geoLocation': {
              latitude:this.state.latitude,
              longitude:this.state.longitude
            }
          };
          iStorage.setItem(id, item);
      } }>
            Submit
          </IonButton>
        </IonModal>

        <IonModal
          isOpen={this.state.showFilterModal}
          onDidDismiss={() => this.setState(() => ({ showFilterModal: false}))}
        >
          <FishListFilter
            filteredTags={this.props.filteredTags}
            allTags={this.props.allTags}
            updateTrackFilters={this.props.updateTrackFilters}
            dismissModal={() => this.setState(() => ({ showFilterModal: false}))}
          />
        </IonModal>

        <IonLoading
          isOpen={this.state.showLoading}
          message={this.state.loadingMessage}
          duration={2000}
          onDidDismiss={() => this.setState(() => ({ 'showLoading': false }))}
        />
        <IonFab ref={this.ionFabRef} slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton  onClick={() => {this.setState({showModal:true})}}>
            <IonIcon name="add"></IonIcon>
          </IonFabButton>
        </IonFab>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  allFiltered: selectors.fishes.allFiltered(state.fishes),
  favoritesFiltered: selectors.fishes.favoritesFiltered(state.fishes),
  searchText: state.fishes.searchText,
  favoriteFishes: state.fishes.favoriteFishes,
  filteredTags: state.fishes.tagFilters,
  allTags: selectors.fishes.allTags(state.fishes)
});

const mapDispatchToProps = {
  updateFishes: () => actions.fishes.updateFishes(),
  updateBranches: () => actions.branches.updateBranches(),
  setSearchText: (searchText: string) => actions.fishes.setSearchText(searchText),
  updateTrackFilters: (trackList: string[]) => actions.fishes.updateTagFilters(trackList),
  addLocation: (location: Location) => actions.locations.updateLocations(location)

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FishesPage);
