# Amadeus API Setup Guide

## 📋 Steps to Get Amadeus API Credentials

### 1. Create Amadeus Account
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Click "Register" and create a free account
3. Verify your email

### 2. Create an App
1. Log in to your Amadeus account
2. Go to "My Apps" → "Create New App"
3. Fill in the details:
   - **App Name**: Travel Agent (or any name you like)
   - **App Description**: Flight search application
4. Click "Create"

### 3. Get API Credentials
After creating the app, you'll see:
- **API Key** (Client ID)
- **API Secret** (Client Secret)

### 4. Configure Your Project

1. Open `/travel-client/.env.local`
2. Replace the placeholders with your actual credentials:

```env
AMADEUS_API_KEY=your_actual_api_key_here
AMADEUS_API_SECRET=your_actual_api_secret_here
```

### 5. Restart the Dev Server

```bash
cd travel-client
npm run dev
```

## 🎯 Testing

The Amadeus Test API provides access to:
- **Real flight data** from major airlines
- **Accurate pricing**
- **Live availability**

Try searching for:
- **MAD** (Madrid) → **LON** (London)
- **NYC** (New York) → **PAR** (Paris)
- **LAX** (Los Angeles) → **SFO** (San Francisco)

## 📊 Free Tier Limits

- **2,000 API calls/month** (Test environment)
- Rate limited to prevent abuse
- Production environment requires approval

## 🔗 Useful Links

- [Amadeus API Documentation](https://developers.amadeus.com/self-service)
- [Flight Offers Search API](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search)
- [API Reference](https://developers.amadeus.com/self-service/apis-docs)

## ⚠️ Important Notes

- The API uses **OAuth 2.0** for authentication
- Access tokens expire after **30 minutes** (handled automatically in the code)
- Use **Test API** for development (`test.api.amadeus.com`)
- Use **Production API** when ready to go live (`api.amadeus.com`)
