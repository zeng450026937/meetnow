import Vue from '../../vue/index';
import Logger from '../../log/index';
import DeviceMedia from './device/device-media';
import ScreenMedia from './device/screen-media';
import { isSameDevice } from './utils';
import { cloneDeep } from '../../vue/src/shared/util';

const logger = Logger.genLogger('Media');

const Media = Vue.extend({
  data() {
    return {
      audioInputDevice  : null, // 麦克风
      audioOutputDevice : null, // 扬声器
      videoInputDevice  : null, // 摄像头
      deviceMedia       : null, // 常规媒体设备
      screenMedia       : null, // 辅流媒体设备
    };
  },

  created() {
    this.deviceMedia = new DeviceMedia();
    this.screenMedia = new ScreenMedia();
  },

  computed : {
    deviceInit() {
      return this.deviceMedia && this.deviceMedia.deviceInit;
    },
    deviceList() {
      return (this.deviceMedia && this.deviceMedia.deviceList) || [];
    },
    // 音频输入设备,音频输出设备,视频输入设备
    audioInputDevices() {
      return this.deviceList.filter((device) => device.kind === 'audioinput') || [];
    },
    audioOutputDevices() {
      return this.deviceList.filter((device) => device.kind === 'audiooutput') || [];
    },
    videoInputDevices() {
      return this.deviceList.filter((device) => device.kind === 'videoinput') || [];
    },
  },

  methods : {
    setVideoInput(deviceId) {
      const current = this.videoInputDevices.find((d) => d.deviceId === deviceId) || this.videoInputDevices[0];

      if (current) this.videoInputDevice = cloneDeep(current);
    },
    setAudioInput(deviceId) {
      const current = this.audioInputDevices.find((d) => d.deviceId === deviceId) || this.audioInputDevices[0];

      if (current) this.audioInputDevice = cloneDeep(current);
    },
    setAudioOutput(deviceId) {
      const current = this.audioOutputDevices.find((d) => d.deviceId === deviceId) || this.audioOutputDevices[0];

      if (current) this.audioOutputDevice = cloneDeep(current);
    },
  },

  watch : {
    // 设备发生改变
    audioInputDevice(device = null) {
      if (isSameDevice(this.deviceMedia.audioDevice, device, true)) return;

      if (device && this.deviceMedia.audioDevice) Object.assign(this.deviceMedia.audioDevice, device);
      else this.deviceMedia.audioDevice = device;

      this.deviceMedia.resetStream().catch(logger.debug);
    },
    audioOutputDevice(device = null) {
      // this.setting.audioOutputDevice = device;
    },
    videoInputDevice(device = null) {
      if (isSameDevice(this.deviceMedia.videoDevice, device, true)) return;

      if (device && this.deviceMedia.videoDevice) Object.assign(this.deviceMedia.videoDevice, device);
      else this.deviceMedia.videoDevice = device;

      this.deviceMedia.resetStream().catch(logger.debug);
    },
    // 设备列表发生改变
    audioInputDevices(devices = []) {
      const using = this.audioInputDevice;

      logger.debug('audioInputDevices updated: ', using);
      this.audioInputDevice = cloneDeep(devices.find((device) => isSameDevice(device, using)) || devices[0]);
    },
    audioOutputDevices(devices = []) {
      const using = this.audioOutputDevice;

      this.audioOutputDevice = cloneDeep(devices.find((device) => isSameDevice(device, using)) || devices[0]);
    },
    videoInputDevices(devices = []) {
      const using = this.videoInputDevice;

      logger.debug('videoInputDevices updated: ', using);
      this.videoInputDevice = cloneDeep(devices.find((device) => isSameDevice(device, using)) || devices[0]);
    },
    'deviceMedia.stream' : function (stream, val) {
      if (stream && !val) {
        let needDetach = false;

        this.deviceList.every((device) => {
          const { deviceId, label } = device;

          needDetach = deviceId === label || !label;

          return !needDetach;
        });

        if (needDetach) this.deviceMedia.detectDevice();
      }
    },
  },

  beforeDestroy() {
    this.deviceMedia.destroy();
    this.screenMedia.destroy();
  },
});

export default Media;
