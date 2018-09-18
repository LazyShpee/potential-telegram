import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, KeyboardAvoidingView, TouchableHighlight, Platform, StatusBar, Keyboard } from 'react-native';

const AVATAR_BOT = require('./resources/bot.png');
const AVATAR_USER = require('./resources/contacts.png');

/*
  user: bool, true if the message was sent by the user, thus being displayed on the right
  text: string, self explanatory
  date: date, any Date() parseable string
  id: number, must be unique, ideally, the message item index
*/
const messages = [
  {
    id: 0,
    user: true,
    text: "Bonjour.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 1,
    user: false,
    text: "Salut.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 2,
    user: false,
    text: "Salut.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 3,
    user: false,
    text: "Salut.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 4,
    user: false,
    text: "Salut. u u uu u u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u u",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    user: true,
    id: 5,
    text: "Salut. u u uu u u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u uu u uu u u  u u u u u",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 6,
    user: false,
    text: "Salut.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 7,
    user: false,
    text: "Salut.",
    date: '2018-09-18T03:57:57.979Z',
  },
  {
    id: 8,
    user: false,
    text: "Salut.",
    date: '2018-09-18T14:57:57.979Z',
  }
]

export default class App extends React.Component {
  state = {
    text: '',
    messages
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
  }

  keyboardWillShow = () => {
    this.scrollToEnd();
  }

  lastUserMessageID = () => {
    for (let i = this.state.messages.length - 1; i >= 0; i--) {
      if (this.state.messages[i].user) return this.state.messages[i].id;
    }

    return -1;
  }

  renderMessage = ({item}) => {
    const side = item.user ? 'right' : 'left';
    const avatar_styles = [styles.message_avatar];
    const text_styles = [styles.message_text, styles[`message_text_${side}`]];

    if (item.id > 0 && this.state.messages[item.id - 1].user === item.user) {
      text_styles.push(styles[`message_text_${side}_top`]);
    }

    if (item.id < this.state.messages.length - 1 && this.state.messages[item.id + 1].user === item.user) {
      text_styles.push(styles[`message_text_${side}_bottom`]);
      avatar_styles.push(styles.message_noavi);
    }

    let footerText;
    if (item.id === this.lastUserMessageID()) {
      footerText = `✓ Vu`;
    } else if (item.id === this.state.messages.length - 1) {
      const date = new Date(this.state.messages[this.state.messages.length - 1].date);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      footerText = `${hours > 12 ? hours % 12 : hours}:${minutes} ${hours > 12 ? 'PM' : 'AM'}`;
    }

    const footer = footerText && <Text style={{[side]: 55, textAlign: side, color: '#D6D6D6'}}>{footerText}</Text>;

    return (
      <View style={{flex: 1}}>
        <View style={[styles.message_item, item.user && styles.message_item_right || styles.message_item_left]}>
          <View style={styles.message_avatar_container}>
            <Image style={avatar_styles} source={item.user && AVATAR_USER || AVATAR_BOT} />
          </View>
          <Text style={text_styles}>{item.text}</Text>
        </View>
        {footer}
      </View>
    );
  }

  addMessage = (text, user) => {
    if (text.length === 0) return;

    const date = new Date(Date.now()).toISOString();
    const message = {
      text, user, date,
      id: this.state.messages.length,
    }

    this.setState((state) => {
      state.messages.push(message);
      state.text = '';
      return state;
    });
    this.messageInput.clear();
    this.scrollToEnd();
  }

  scrollToEnd = () => {
    const wait = new Promise((resolve) => setTimeout(resolve, 0));
    wait.then( () => {
        this.messageList.scrollToEnd({ animated: true });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <View style={styles.header}>
            <Text style={styles.header_text}>Assistant de</Text>
            <Text style={[styles.header_text, { fontWeight: 'bold' }]}>David Richard</Text>
          </View>
          <View style={{width: '100%', alignItems: 'center', position: 'absolute'}}>
            <View style={styles.header_avatar_container}>
              <Image style={styles.header_avatar} source={AVATAR_BOT}/>
            </View>
          </View>

          <FlatList
            data={this.state.messages}
            renderItem={this.renderMessage}
            ListFooterComponent={this.listFooter}
            extraData={this.state}
            keyExtractor={item => `${item.id}`}
            ref={list => { this.messageList = list }}
          />

          <View style={styles.footer}>
            <TextInput
              underlineColorAndroid={'#00000000'}
              placeholder='Ecrivez un message...'
              style={styles.input}
              value={this.state.text}
              onChangeText={(text) => this.setState({text})}
              onSubmitEditing={() => this.addMessage(this.state.text, true)}
              returnKeyType='send'
              ref={input => { this.messageInput = input }}
            />
            <TouchableHighlight onPress={() => this.addMessage(this.state.text, true)} style={styles.send_container}>
              <Image style={styles.send_button} source={require('./resources/plane.png')} />
            </TouchableHighlight>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const padTop = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    width: '100%',
  },

  header: {
    flexBasis: 40 + padTop,
    width: '100%',
    backgroundColor: '#475cff',
    paddingLeft: 10,
    paddingTop: padTop,
  },

  header_text: {
    color: '#f6f6f6',
  },

  header_avatar_container: {
    position: 'absolute',
    top: padTop + 10,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#475cff',
    zIndex: 10,
  },

  header_avatar: {
    width: 40,
    height: 40,
  },

  message_list: {
    width: '100%',
  },

  message_item: {
    flex: 1,
    width: '100%',
    paddingRight: 100,
    paddingLeft: 5,
  },
  
  message_item_right: {
    flexDirection: 'row-reverse',
  },
  
  message_item_left: {
    flexDirection: 'row',
  },

  message_text: {
    fontWeight: 'bold',
    
    marginRight: 5,
    marginLeft: 5,
    marginTop: 2.5,
    marginBottom: 2.5,
    
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    
    borderRadius: 20,
    
    left: 0,
    right: -60,
  },
  
  message_text_right: {
    backgroundColor: '#475cff',
    color: '#fefefe'
  },
  
  message_text_left: {
    backgroundColor: '#fff',
    color: '#b6b8c4',

    /*
      Shadows would be there if I had actual values and if implementaion wasn't platform specific
      https://facebook.github.io/react-native/docs/shadow-props
    */
  },

  message_text_right_top: {
    borderTopRightRadius: 5,
  },

  message_text_right_bottom: {
    borderBottomRightRadius: 5,
  },

  message_text_left_top: {
    borderTopLeftRadius: 5,
  },

  message_text_left_bottom: {
    borderBottomLeftRadius: 5,
  },

  message_noavi: {
    height: 0,
  },

  message_avatar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  message_avatar_container: {
    marginTop: 'auto',
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  footer: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 5,
  },

  input: {
    flex: 1,
    fontWeight: 'bold',
    color: '#b6b8c4',
    marginLeft: 5,
    marginRight: 5,
  },

  send_container: {
    backgroundColor: '#1af3b9',
    borderRadius: 20,
    marginRight: 5,
    flexBasis: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',

  },

  send_button: {
    width: 22,
    resizeMode: 'contain',
  },
});
