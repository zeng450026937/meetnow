<template>
  <div class="member">
    <div class="member__content-item">
      <span class="label">主持人 ({{ presenterList.length }}) </span>
      <member-item
        v-for="(item) in presenterList"
        :key="item.getEntity()"
        :item="item"
        :hasPermission="hasPermission"
        :speakMode="speakMode"
        @updateList="initUsersList"
      ></member-item>
    </div>
    <div class="member__content-item">
      <span class="label">与会者 ({{ attendeeList.length }}) </span>
      <member-item
        v-for="(item) in attendeeList"
        :key="item.getEntity()"
        :item="item"
        :hasPermission="hasPermission"
        :speakMode="speakMode"
        @updateList="initUsersList"
      ></member-item>
    </div>
    <div class="member__content-item">
      <span class="label">广播方 ({{ castviewerList.length }}) </span>
      <member-item
        v-for="(item) in castviewerList"
        :key="item.getEntity()"
        :item="item"
        :hasPermission="hasPermission"
        :speakMode="speakMode"
        @updateList="initUsersList"
      ></member-item>
    </div>
    <div class="member__content-item">
      <span class="label">会议大厅 ({{ onholdList.length }}) </span>
      <member-item
        v-for="(item) in onholdList"
        :key="item.getEntity()"
        :item="item"
        :hasPermission="hasPermission"
        memberType="onHold"
        @updateList="initUsersList"
      ></member-item>
    </div>
    <div class="member__content-item">
      <span class="label">申请发言 ({{ handupList.length }}) </span>
      <member-item
        v-for="(item) in handupList"
        :key="item.getEntity()"
        :item="item"
        :hasPermission="hasPermission"
        memberType="handUp"
        @updateList="initUsersList"
      ></member-item>
    </div>
    <div class="member-control">
      <span
        class="control-button"
        @click="onQuitClick"
      >
        <icon-font type="icontalk_end_call"></icon-font>
      </span>
    </div>
  </div>
</template>

<script>
import MemberItem from './member-item.vue';

export default {
  name : 'Member',

  components : {
    MemberItem,
  },

  props : {
    users : {
      type    : Object,
      default : () => { },
    },
    hasPermission : {
      type    : Boolean,
      default : false,
    },
    speakMode : {
      type    : String,
      default : 'free',
    },
  },

  data() {
    return {
      presenterList  : [],
      attendeeList   : [],
      castviewerList : [],
      handupList     : [],
      onholdList     : [],
    };
  },

  computed : {

  },

  created() {

  },

  mounted() {

  },

  beforeDestroy() {
    if (!this.users) return;
    this.users.off(['user:added', 'user: deleted']);
    this.initUsersList();
  },

  methods : {
    onQuitClick() {
      this.$emit('onQuitClick');
    },

    initUsersList() {
      this.presenterList = [...this.users.getOrganizer(), ...this.users.getPresenter()];
      this.attendeeList = this.users.getAttendee();
      this.castviewerList = this.users.getCastviewer();
      this.handupList = this.users.getHandup();
      this.onholdList = this.users.getOnhold();
    },

    initBindEvent() {
      if (!this.users) return;
      this.users.off(['user:added', 'user: deleted']);
      this.initUsersList();
      this.users.on('user:added', () => {
        console.debug(' -> user:added');
        this.initUsersList();
      });
      this.users.on('user:deleted', () => {
        console.debug(' -> user:deleted');
        this.initUsersList();
      });
    },
  },

  watch : {
    users : {
      handler() {
        this.initBindEvent();
      },
      immediate : true,
    },
  },
};
</script>

<style lang="scss" scoped>
.member {
  position: relative;
  display: flex;

  flex-direction: column;

  width: 100%;
  height: 100%;

  padding: 0 20px;
  padding-top: 60px;

  .member__content-item {
    margin: 10px 0;

    .label {
      color: #999;
      font-size: 12px;
    }
  }

  .member-control {
    width: 360px;
    height: 48px;
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;

    margin: 20px 0;
  }
  .control-button {
    display: flex;

    align-items: center;
    justify-content: center;

    height: 36px;
    width: 96px;

    background-color: red;
    color: #ffffff;

    border-radius: 24px;

    cursor: pointer;
  }
}
</style>
