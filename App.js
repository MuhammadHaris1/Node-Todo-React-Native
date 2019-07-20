import React from 'react';
import { StyleSheet,  View, ScrollView, TextInput } from 'react-native';
import { Header, Input, Button, ListItem, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
// import { ScrollView } from 'react-native-gesture-handler';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      text: '',
      result: [],
      currentIndex: null,
      _id: ''
    }
    this.addList = this.addList.bind(this)
    this.cancel = this.cancel.bind(this)
    this.update = this.update.bind(this)
  }

  addList() {
    const { text } = this.state
    fetch("https://todo-app-18253.herokuapp.com/list/add/",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ text })
      })
      .then(function (res) { console.log(res) })
      .catch(function (res) { console.log(res) })

    fetch("https://todo-app-18253.herokuapp.com/list/getAll/")
      .then(res => res.json())
      .then(result => this.setState({ result, text: '' }))
      .catch(err => console.log(err))
  }

  edit(index, key) {
    const { result } = this.state;
    console.log(index)
    this.setState({ text: result[index -1].text , currentIndex: index, _id: key })
  }

  cancel() {
    this.setState({ text: '', currentIndex: null })
  }

  update() {
    const { text, result, currentIndex } = this.state;
    console.log(result[currentIndex-1]._id)
   
    fetch("https://todo-app-18253.herokuapp.com/list/update/",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify({ text, _id: result[currentIndex-1]._id})
      })
      .then(function (res) { console.log(res) })
      .catch(function (res) { console.log(res) })

    fetch("https://todo-app-18253.herokuapp.com/list/getAll/")
      .then(res => res.json())
      .then(result => this.setState({ result, text: '', currentIndex: null }))
      .catch(err => console.log(err))
   
  }

  delete(key) {

    fetch("https://todo-app-18253.herokuapp.com/list/delete/",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "DELETE",
        body: JSON.stringify({ _id: key})
      })
      .then(function (res) { console.log(res) })
      .catch(function (res) { console.log(res) })

    fetch("https://todo-app-18253.herokuapp.com/list/getAll/")
      .then(res => res.json())
      .then(result => this.setState({ result, text: '' }))
      .catch(err => console.log(err))
  }

  componentDidMount() {
    fetch('https://todo-app-18253.herokuapp.com/list/getAll/')
      .then(res => res.json())
      .then(result => this.setState({ result }))
      .catch(err => console.log(err))
  }

  renderTodos() {
    const { result } = this.state;
    return (
      <View style={{ padding: 10 }}>
        {
          result && result.map((l, i) => {
            <View key={Math.random()}>
              <ListItem
                key={i}
                // leftAvatar={{ source: { uri: l.avatar_url } }}
                title={`${++i}) ${l.text}`}
              // subtitle={l.subtitle}
              />
              <Button
                title='Edit'
                buttonStyle={{
                  width: 100
                }}
                icon={
                  <Icon
                    name='arrow-right'
                    size={15}
                    color='white'
                  />
                }
                onPress={this.edit.bind(this, i, l._id)}
              />
              <Button
                title='Delete'
                buttonStyle={{
                  backgroundColor: 'red',
                  width: 100
                }}
                icon={
                  <Icon
                    name='arrow-right'
                    size={15}
                    color='white'
                  />

                }
              onPress={this.delete.bind(this, l._id)}
              />
            </View>
          })
        }
      </View>
    )
  }

  render() {
    const { currentIndex, result } = this.state;
    // console.log(this.state.text, result)
    return (
      <ScrollView>
        <View>
          <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'Todo App', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
          />

          <View style={{ padding: 20 }}>
            <Input
              // style={{}}
              // containerStyle={{border:'2px'}}
              placeholder='enter text'
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
            />
            {currentIndex == null ? <Button
              title='Add To List'
              buttonStyle={{width: 150, alignContent: 'center', alignItems: 'center', marginLeft: 60, marginTop: 20}}
              icon={
                <Icon
                  name='arrow-right'
                  size={15}
                  color='white'
                />
              }
              onPress={this.addList}
            />
              :
              <View>
                <Button
                  title='Update'
                  buttonStyle={{width: 150, alignContent: 'center', alignItems: 'center', marginLeft: 60, marginTop: 20}}
                  icon={
                    <Icon
                      name='arrow-right'
                      size={15}
                      color='white'
                    />
                  }
                  onPress={this.update}
                /><Button
                  title='Cancel'
                  buttonStyle={{width: 150, alignContent: 'center', alignItems: 'center', marginLeft: 60, marginTop: 20}}
                  icon={
                    <Icon
                      name='arrow-right'
                      size={15}
                      color='white'
                    />
                  }
                  onPress={this.cancel}
                />
              </View>}
          </View>
        </View>
        {currentIndex != null && <Text h4 style={{alignItems: 'center', alignContent: 'center', flex: 1}}>You editing item # {currentIndex} currently!</Text>}

        {this.renderTodos()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
