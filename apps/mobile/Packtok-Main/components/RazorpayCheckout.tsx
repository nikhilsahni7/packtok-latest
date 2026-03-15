import React, { useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Feather } from "@expo/vector-icons";

interface RazorpayCheckoutProps {
  visible: boolean;
  razorpayKey: string;
  razorpayOrderId: string;
  amount: number; // in minor units (paise)
  currency: string;
  orderId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => void;
  onFailure: (error: string) => void;
  onClose: () => void;
}

export default function RazorpayCheckout({
  visible,
  razorpayKey,
  razorpayOrderId,
  amount,
  currency,
  orderId,
  userName,
  userEmail,
  userPhone,
  onSuccess,
  onFailure,
  onClose,
}: RazorpayCheckoutProps) {
  const webViewRef = useRef<WebView>(null);

  const displayAmount = (amount / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .loading-container {
      text-align: center;
      color: #666;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #f97316;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading-text {
      font-size: 16px;
      font-weight: 500;
      color: #374151;
    }
    .error-text {
      color: #ef4444;
      font-size: 14px;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div class="loading-container" id="loading">
    <div class="spinner"></div>
    <p class="loading-text">Opening payment gateway...</p>
  </div>

  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    try {
      var options = {
        key: '${razorpayKey}',
        amount: ${amount},
        currency: '${currency}',
        name: 'Packtok',
        description: 'Order Payment',
        order_id: '${razorpayOrderId}',
        prefill: {
          name: '${(userName || "").replace(/'/g, "\\'")}',
          email: '${(userEmail || "").replace(/'/g, "\\'")}',
          contact: '${(userPhone || "").replace(/'/g, "\\'")}',
        },
        theme: {
          color: '#F97316',
        },
        handler: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_SUCCESS',
            data: {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }
          }));
        },
        modal: {
          ondismiss: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PAYMENT_DISMISSED',
            }));
          },
          escape: false,
          confirm_close: true,
        },
      };

      var rzp = new Razorpay(options);

      rzp.on('payment.failed', function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'PAYMENT_FAILED',
          error: response.error ? response.error.description : 'Payment failed',
        }));
      });

      // Small delay to ensure script is loaded
      setTimeout(function() {
        rzp.open();
      }, 500);

    } catch (e) {
      document.getElementById('loading').innerHTML =
        '<p class="error-text">Failed to initialize payment: ' + e.message + '</p>';
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PAYMENT_ERROR',
        error: e.message,
      }));
    }
  </script>
</body>
</html>
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case "PAYMENT_SUCCESS":
          onSuccess(message.data);
          break;
        case "PAYMENT_FAILED":
          onFailure(message.error || "Payment failed");
          break;
        case "PAYMENT_DISMISSED":
          onClose();
          break;
        case "PAYMENT_ERROR":
          onFailure(message.error || "Payment initialization failed");
          break;
      }
    } catch (e) {
      console.error("WebView message parse error:", e);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
              <Feather name="credit-card" size={16} color="#F97316" />
            </View>
            <View>
              <Text className="text-base font-bold text-gray-900">
                Pay {currency} {displayAmount}
              </Text>
              <Text className="text-xs text-gray-500">
                Secured by Razorpay
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center bg-gray-100 rounded-full"
          >
            <Feather name="x" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* WebView */}
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#F97316" />
              <Text className="text-gray-500 mt-3">Loading payment...</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    </Modal>
  );
}
