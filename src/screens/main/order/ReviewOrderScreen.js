import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { orderService } from "../../../services/orderService";
import { API_URL_IMAGE } from "../../../constants/config";

const ReviewOrderScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all reviews for the current user
      const allReviews = await orderService.getMyReviews();
      console.log("All reviews:", allReviews);

      if (!allReviews || !Array.isArray(allReviews)) {
        throw new Error("Không thể tải dữ liệu đánh giá");
      }

      // Filter reviews for this specific order
      const orderReviews = allReviews.filter(
        (review) => review.orderId && review.orderId._id === orderId
      );

      console.log("Order reviews:", orderReviews);
      setReviews(orderReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(
        error.message || "Không thể tải đánh giá. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [orderId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  const handleRatingChange = (reviewId, rating) => {
    setReviews(
      reviews.map((review) =>
        review._id === reviewId ? { ...review, rating } : review
      )
    );
  };

  const handleCommentChange = (reviewId, comment) => {
    setReviews(
      reviews.map((review) =>
        review._id === reviewId ? { ...review, comment } : review
      )
    );
  };

  const handleSubmitReview = async (reviewId) => {
    try {
      const review = reviews.find((r) => r._id === reviewId);
      if (!review) return;

      setLoading(true);
      await orderService.rateOrder(reviewId, review.rating, review.comment);

      Alert.alert("Thành công", "Cảm ơn bạn đã đánh giá!");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể gửi đánh giá. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStar = (reviewId, index, currentRating) => {
    const filled = index <= currentRating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleRatingChange(reviewId, index)}
        style={styles.starContainer}
      >
        <Icon
          name={filled ? "star" : "star-outline"}
          size={30}
          color={filled ? "#FFD700" : "#CCCCCC"}
        />
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9900" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#FF4D4F" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchReviews}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>

      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="emoticon-sad-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>Chưa có món ăn để đánh giá</Text>
        </View>
      ) : (
        reviews.map((review) => (
          <View key={review._id} style={styles.reviewCard}>
            <View style={styles.foodInfo}>
              <Image
                source={{
                  uri: `${API_URL_IMAGE}${review.foodId.image}`,
                }}
                style={styles.foodImage}
              />
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>{review.foodId.name}</Text>
                <Text style={styles.shopName}>
                  {review.orderId.shopId.shopName}
                </Text>
              </View>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Đánh giá của bạn:</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((index) =>
                  renderStar(review._id, index, review.rating)
                )}
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Nhận xét của bạn (không bắt buộc)"
              value={review.comment}
              onChangeText={(text) => handleCommentChange(review._id, text)}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                review.reviewed && styles.submittedButton,
              ]}
              onPress={() => handleSubmitReview(review._id)}
              disabled={review.reviewed}
            >
              <Text style={styles.submitButtonText}>
                {review.reviewed ? "Đã đánh giá" : "Gửi đánh giá"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  contentContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF9900",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 16,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starContainer: {
    marginRight: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#FF9900",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  submittedButton: {
    backgroundColor: "#8BC34A",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReviewOrderScreen;
