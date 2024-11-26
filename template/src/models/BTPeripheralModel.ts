class BTPeripheralModel {
  peripheralId;
  rssi;
  constructor(peripheralId?: String, rssi?: number) {
    this.peripheralId = peripheralId;
    this.rssi = rssi;
  }
}

export default BTPeripheralModel;
