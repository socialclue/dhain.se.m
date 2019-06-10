import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState, selectors, actions } from '../store';
import FishList from '../components/FishList';
import FishListFilter from '../components/FishListFilter';
import { withRouter, RouteComponentProps } from "react-router";
import { IonModal, IonItem, IonLabel, IonInput, IonLoading, IonToast, IonIcon, IonHeader, IonToolbar, IonButtons, IonMenuButton,
    IonSegment, IonSegmentButton, IonButton, IonSearchbar, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabList, IonFabButton, IonAlert, IonText } from '@ionic/react';
import './FishesPage.css';


type Props =  RouteComponentProps<{}> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

type State = {
  segment: string,
  isRefreshing: boolean,
  showLoading: boolean,
  showFilterModal: boolean,
  loadingMessage: string,
  showModal: boolean
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
    showModal: false
  }

  constructor(props: Props) {
    super(props);

    props.updateFishes();
    props.updateBranches();

    this.ionRefresherRef = React.createRef<HTMLIonRefresherElement>();
    this.ionFabRef = React.createRef<HTMLIonFabElement>();
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
          <IonRefresher ref={this.ionRefresherRef} onIonRefresh={this.doRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonToast
            isOpen={this.state.isRefreshing}
            message="Updating content"
            showCloseButton={true}
            duration={2000}
            onDidDismiss={() => this.setState(() => ({ 'isRefreshing': false }))}
          ></IonToast>

          <FishList
            fishes={this.props.allFiltered}
            listType={"all"}
            hidden={this.state.segment === "favorites"}
          />
          <FishList
            fishes={this.props.favoritesFiltered}
            listType={"favorites"}
            hidden={this.state.segment === "all"}
          />
        </IonContent>

        <IonModal
        isOpen={this.state.showModal}
        onDidDismiss={() => this.setState(() => ({ showModal: false }))}>
          <IonText color="primary" text-center>
          <h2>Add details</h2>
        </IonText>
          <IonItem text-center>
            <IonLabel position="fixed">Name</IonLabel>
            <IonInput  placeholder="Enter Your Name"></IonInput>
          </IonItem>
          <IonButton onClick={() => this.setState(() => ({ showModal: false }))}>
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
  updateTrackFilters: (trackList: string[]) => actions.fishes.updateTagFilters(trackList)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FishesPage);
