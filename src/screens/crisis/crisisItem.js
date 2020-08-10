import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, Badge } from "react-native-elements";
import { crisisItem as styles } from "./styles";
import Swipeout from "react-native-swipeout";
import { crisisCheckinQuery, getCrisisItemsQuery } from "../../queries/crisis";
import { compose, graphql } from "react-apollo";
import Icon from "../../common/icons";

class CrisisItem extends Component {
  state = {
    count: this.props.count || 0
  };
  updateCount = obj => {
    let count = this.state.count;
    count++;
    this.setState({ count });
    this.props.setLoading(true);
    this.props
      .onCrisisCheckin(obj)
      .then(res => {
        console.log("Checkin Successful", res);
      })
      .catch(err => {
        console.log("Checkin Error: ", err);
        this.setState({ count: count - 1 });
      })
      .finally(() => {
        this.props.setLoading(false);
      });
  };

  componentWillMount() {
    this.props.setSaveRef(this.updateCount);
  }

  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false;
    }
    return true;
  }

  // updateCount = direction => {
  //   console.log("Update Count");
  //   let count = this.state.count;
  //   count = count  + direction;
  //   console.log("Updated Count: ", count);
  //   this.setState({count})
  // }

  render() {
    const {
      title,
      tags,
      onCountPress,
      showDescription,
      onEdit,
      onDelete,
      onCheckin
    } = this.props;
    const { count } = this.state;
    console.log("Render ", count);
    const swipeoutBtns = [
      {
        text: "Edit",
        backgroundColor: "#3F51B5",
        onPress: onEdit
      },
      {
        text: "Delete",
        backgroundColor: "#f44336",
        onPress: onDelete
      }
    ];
    return (
      <Swipeout right={swipeoutBtns} backgroundColor="#fff">
        <TouchableOpacity
          onPress={onCheckin}
          style={{
            flexDirection: "row",
            bottomBorderWidth: 1,
            bottomBorderColor: "#333",
            paddingHorizontal: 12,
            paddingVertical: 16
          }}
        >
          <View style={{ backgroundColor: "white", flex: 1 }}>
            <TitleContainer title={title} onPress={showDescription} />
            <TagContainer tags={tags} />
          </View>
          <HeartButton
            count={count}
            onCountPress={onCountPress}
            // onLikePress={this.updateCount}
            onLikePress={showDescription}
          />
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

const TitleContainer = ({ title, onPress }) => (
  <TouchableOpacity style={styles.title} onPress={onPress}>
    <Text style={styles.itemTitleText}>{title}</Text>
    {/*} <Icon name="ios-book-outline" size={22}  /> */}
  </TouchableOpacity>
);

const HeartButton = ({ count, onCountPress, onLikePress }) => (
  <Fragment>
    <TouchableOpacity style={styles.likeButton} onPress={onLikePress}>
      <Icon
        size={32}
        color={ThemeStyle.mainColor}
        name="ios-information-circle-outline"
        family="Ionicons"
      />
    </TouchableOpacity>
    {!!count && (
      <TouchableOpacity style={styles.likeButton} onPress={onCountPress}>
        <Icon
          name="md-time"
          size={32}
          color={"#777"}
          family="Ionicons"
        />
      </TouchableOpacity>
    )}
  </Fragment>
);

const TagContainer = ({ tags }) => (
  <View style={styles.tagContainer}>
    {tags.map(tag => (
      <Tag name={tag} key={tag} />
    ))}
  </View>
);

const Tag = ({ name }) => (
  <Badge containerStyle={styles.tag}>
    <Text style={styles.tagText}>{name}</Text>
  </Badge>
);

export default compose(
  graphql(crisisCheckinQuery, {
    props: props => ({
      onCrisisCheckin: checkin =>
        props.mutate({
          variables: checkin,
          optimisticResponse: () => ({ checkinCrisisItem: checkin })
        })
    }),
    options: {
      refetchQueries: [{ query: getCrisisItemsQuery }],
      update: (dataProxy, fetchedObj) => {
        const query = getCrisisItemsQuery;
        const data = dataProxy.readQuery({ query });
        let response = fetchedObj.data.checkinCrisisItem.msg;
        if (response.length) {
          let obj = JSON.parse(response);
          console.log("Fetched Obj", obj);
          data.getCrisisItems.filter(item => {
            if (item.id === obj.id) {
              item.checkinCount = obj.checkinCount;
              item.checkinDates = obj.checkinDates;
            }
            return item;
          });
          dataProxy.writeQuery({ query, data });
        }
      }
    }
  })
)(CrisisItem);
