import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../store';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPopover, IonTitle, IonToolbar} from '@ionic/react';
import './About.css';
import AboutPopover from '../components/AboutPopover';

type Props = ReturnType<typeof mapStateToProps>

type State = {
    showPopover: boolean,
    showPopoverEvent: null | MouseEvent
}

class About extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showPopover: false,
            showPopoverEvent: null
        };
    }

    presentPopover = (e: MouseEvent) => {
        this.setState(() => ({
            showPopover: true,
            showPopoverEvent: e
        }));
    };

    dismissPopover = () => {
        this.setState(() => ({
            'showPopover': false,
            'showPopoverEvent': null
        }));
    };

    render() {
        return (
            <>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>About</IonTitle>
                        <IonButtons slot="end">
                            <IonButton icon-only onClick={this.presentPopover}>
                                <IonIcon slot="icon-only" name="more"></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonPopover
                    isOpen={this.state.showPopover}
                    event={this.state.showPopoverEvent}
                    onDidDismiss={this.dismissPopover}
                >
                    <AboutPopover
                        dismissPopover={this.dismissPopover}
                    />
                </IonPopover>

                <IonContent>
                    <div className="about-header">
                        <img src="assets/img/fishlogo.png" alt="Steve's Fish Emporium"/>
                    </div>
                    <div className="ion-padding about-info">
                        <h4>Dhain Se, Lets go</h4>

                        <p>
                            Mark meta data where ever you go and trade ,for real money.
                            <br/> <br/>
                            Collect your metadata by just filling a some basic info, and we do the rest, pay the fees, get your data listed.
                            <br/> <br/>
                            Economic explained here.
                        </p>
                    </div>
                </IonContent>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({});

export default connect(
    mapStateToProps
)(About);
