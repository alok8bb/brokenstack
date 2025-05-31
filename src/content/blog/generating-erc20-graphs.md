---
title: 'Plotting candlestick charts for ERC20 tokens using GeckoTerminal API & Plotly'
description: ""
pubDate: '27 Jun 2024'
category: 'home'
---

Recently for work, I wrote a Python script to generate trading charts for ERC20 tokens on the Ethereum mainnet using [GeckoTerminal API](https://www.geckoterminal.com/dex-api). 

Candlestick charts are plotted using OHLCV (Open, High, Low, Close, Volume) data, which encapsulates the price movements of a financial asset over a specific time period. Each candlestick on the chart represents this data within a given timeframe, commonly ranging from minutes to days depending on the trading frequency and analysis requirements.

The following snippet illustrates how OHLCV data is retrieved from the GeckoTerminal API and plotted:

```python
import requests
import os
from datetime import datetime

# Pepe coin's pair address
# https://dexscreener.com/ethereum/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f
pair = "0xA43fe16908251ee70EF74718545e4FE6C5cCEc9f"

"""
API Documentation: https://www.geckoterminal.com/dex-api

time period to aggregate for each ohlcv (eg. /minute?aggregate=15 for 15m ohlcv)
Available values (day): 1
Available values (hour): 1, 4, 12
Available values (minute): 1, 5, 15
"""
res = requests.get(f"https://api.geckoterminal.com/api/v2/networks/eth/pools/{pair}/ohlcv/hour?aggregate=1")

def separate_data(data):
    timestamps = []
    o_values = []
    h_values = []
    c_values = []
    l_values = []
    v_values = []

    for entry in data:
        timestamps.append(epoch_to_date(entry[0]))
        o_values.append(entry[1])
        h_values.append(entry[2])
        c_values.append(entry[3])
        l_values.append(entry[4])
        v_values.append(entry[5])

    return timestamps, o_values, h_values, c_values, l_values, v_values

def epoch_to_date(epoch_timestamp):
    date_time = datetime.fromtimestamp(epoch_timestamp)
    date_string = date_time.strftime('%Y-%m-%d %H:%M:%S')
    return date_string

import plotly.graph_objects as go

if res.ok:
    data = res.json()
    ohlcv = data['data']['attributes']['ohlcv_list']

    timestamps, o_values, h_values, c_values, l_values, v_values = separate_data(ohlcv)
    layout = go.Layout(
        margin=go.layout.Margin(
                l=0, 
                r=0, 
                b=0, 
                t=0, 
            )
    )
    fig = go.Figure(data=[go.Candlestick(
        x=timestamps,
        open=o_values,
        high=h_values,
        low=c_values,
        close=l_values,
    )], layout=layout)
    cs = fig.data[0]
    cs.increasing.fillcolor = '#3D9970'
    cs.increasing.line.color = '#3D9970'
    cs.decreasing.fillcolor = '#FF4136'
    cs.decreasing.line.color = '#FF4136'

    fig.update_yaxes(tickformat=".5f")
    fig.update_xaxes(tickformat="%d %B %Y", tickangle=-45)
    fig.update_layout(xaxis_rangeslider_visible=False)
    if not os.path.exists("images"):
        os.mkdir("images")
    fig.write_image("images/fig1.png")
```

#### Output: 
Saved in `/images/fig1.png`
![Pepe Chart](https://i.imgur.com/BFbphe7.png)


Chart can be further customized using plotly's amazing configuration options for almost everything in the image.