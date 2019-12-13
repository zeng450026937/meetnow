import Vue from '../../vue/index';
import Participant from './participant';
import { EVENTS } from '../../handler/event-dispatcher';

const Member = Vue.extend({
  data() {
    return {
      memberStore : new Map(),
      memberList  : [],
      memberInit  : false,
    };
  },
  computed : {
    current() {
      return this.memberList.find((member) => member.isSelf) || {};
    },
    organizer() {
      return this.memberList.filter(((member) => member.roles.isOrganizer));
    },
    presenters() {
      return this.memberList.filter(((member) => member.roles.isPresenter));
    },
    attendees() {
      return this.memberList.filter(((member) => member.roles.isAttendee
          && !member.endpoint.onHold
          && member.endpoint.connected));
    },
    onHolds() {
      return this.memberList.filter(((member) => member.roles.isAttendee
        && member.endpoint.onHold));
    },
    applicants() { // Hand up
      return this.memberList.filter(((member) => member.audio.ingressUnblocking));
    },
    castViewers() {
      return this.memberList.filter(((member) => member.roles.isCastviewer
        && member.endpoint.connected));
    },
  },
  methods : {
    initMembers(memberInfo) {
      const memberList = memberInfo.user;
      const state = memberInfo.state;

      if (state === 'full') this.reset();
      if (!memberList || !Array.isArray(memberList)) return [];

      memberList.forEach((member) => {
        const existMember = this.memberStore.get(member.entity);

        if (!existMember) { // Add New Member
          this.addNewMember(member);
        }
        else if (existMember && member.state !== 'deleted') { // Update Member Info
          this.updateMemberInfo(member, existMember);
        }
        else { // Member is deleted
          this.memberStore.delete(member.entity);

          if (existMember.hasJoin) this.$emit(EVENTS.MEMBER_EXIT_CONF, existMember);
        }
      });

      this.memberList = Array.from(this.memberStore.values()).filter((user) => user.hasJoin);
      this.memberInit = true;

      this.$emit(EVENTS.MEMBER_UPDATED, this.memberList);

      return this.memberList;
    },
    updateCurrent(entity) {
      if (!entity) entity = `${ this.$root.ua.userInfo.userId }`;
      if (this.current.entity === entity) return;

      this.memberList.forEach((member) => member.isSelf = member.entity === entity);
    },

    updateMemberInfo(current, previous) {
      current.preInfo = previous;
      current = new Participant(current);

      const isNewJoin = current.endpoint.connected && !previous.endpoint.connected;

      previous.updatePartial(current);

      if (isNewJoin) this.$emit(EVENTS.MEMBER_JOIN_CONF, previous);
    },

    addNewMember(member) {
      const newMember = new Participant(member);

      if (newMember.endpoint.connected) {
        this.$emit(member.state === 'deleted'
          ? EVENTS.MEMBER_EXIT_CONF
          : EVENTS.MEMBER_JOIN_CONF, newMember);
      }
      this.memberStore.set(member.entity, newMember);
    },

    reset() {
      this.memberStore = new Map();
      this.memberList = [];
      this.memberInit = false;
    },
  },
});

export default Member;
