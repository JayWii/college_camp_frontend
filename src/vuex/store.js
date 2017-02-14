import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      host : 'http://127.0.0.1:3000',
      camp_info :  {
          title : '...',
          sub_title : '...',
          time : {
              start_time : '2017-1-1',
              end_time : '2017-2-1'
          }
      },
      user_info : {
          open_id : 0,
          active_state: 0,
          daka_state: [],
          user_name: '',
          learning_state_list : [4,4,4,4,4,4,4,4,4,4,4,4,4] //0:休息日，1:未学习，2:已学习未复习，3:已学习已复习，4:未到时间
      },
      active_day_data : {
          camp_data : {
              word_list : [
                {
                  en : 'activity',
                  meaning : '活动',
                  count : 75, // 考试频率
                }
              ],
              reading : [
                  {
                      id : '0_0_0', //第1期,第1天,第1个单词
                      word : 'union',
                      phonetic : '[ˈju:niən]',//音标
                      usage : [
                          {
                              basic : 'trade/labor union      工会',
                              eg : 'As recently as five years ago, US migration was twice the rate of European Union states.\n就在最近5年之前，美国移民率是欧盟国家的两倍。'
                          },
                          {
                              basic : 'european union (EU)	欧盟',
                              eg : ''//eg若无则为空
                          },
                          {basic : 'Union Jack    英国国旗',eg : ''},
                          {basic : 'union is strength     团结就是力量',eg : ''}
                      ],
                      test_center : [
                          {
                              basic : 'union作为名词考查',
                              eg : {
                                  content : 'As recently as five years ago, US migration was twice the rate of European Union states.\n就在最近5年之前，美国移民率是欧盟国家的两倍。',
                                  source : '<CET4.2011年6月>' //source可为空
                              }
                          },
                          {
                              basic : 'union的变形：\nreunion n.		重聚 ,（班级或学校的）同学会',
                              eg : '' //content和source都为空的话eg直接为空
                          }
                      ]
                  }
              ]
          },
          user_data : {
              daka_state : 0 //0:未打卡，1:已打卡
          }
      },
      active_day : 0,
      study_progress : 0, //学习进度
      study_data_index : 0,
      active_word_detail : {},
      review_data_index : 0,
      word_detail_index : 0
  },
  getters: {
    today : state => {
        var strArr = state.camp_info.time.start_time.split('-')
        var start_time = new Date(strArr[0],strArr[1]-1,strArr[2])
        var todayIndex = (Math.floor(((new Date()) - start_time)/1000/60/60/24))
        return todayIndex
    },
    days : state => {
        function getDateData(dateStr) {
            var strArr = dateStr.split('-')
            var date = new Date(strArr[0],strArr[1]-1,strArr[2])
            return date
        }
        function getDays(date) {
            return (Math.floor(date/1000/60/60/24))
        }
        var days = getDays(getDateData(state.camp_info.time.end_time) - getDateData(state.camp_info.time.start_time))
        return days
    },
    active_dayState : state => { //0:休息日，1:未学习，2:已学习未复习，3:已学习已复习，4:未到时间
        return state.user_info.learning_state_list[state.active_day]
    }
  },
  mutations: {
      UPDATE_USER_INFO (state, data) {
          state.user_info = data
      },
      UPDATE_WORD_LIST (state, data) {
          state.active_day_data.camp_data.word_list = data
      },
      UPDATE_READING_DATA (state, data) {
          state.active_day_data.camp_data.reading = data
      },
      SET_CAMP_INFO (state, data) {
          state.camp_info = data
      },
      UPDATE_ACTIVE_DATE (state, dateIndex) {
          state.active_day = dateIndex
      },
      INIT_STATE_LIST (state, newList) {
          state.user_info.learning_state_list = newList
      },
      UPDATE_STUDY_PROGRESS (state, progress) {
          state.study_progress = progress
      },
      SET_ACTIVE_DETAIL (state, word_detail) {
          state.active_word_detail = word_detail
      },
      UPDATE_STUDY_STATE (state, newState) {
          state.user_info.learning_state_list.splice(newState.dayIndex, 1, newState.dayState)
      },
      UPDATE_STUDY_DATA (state, index) {
          state.study_data_index = index
      },
      UPDATE_REVIEW_DATA (state, index) {
          state.review_data_index = index
      },
      INIT_DETAIL_INDEX (state, index) {
          state.word_detail_index = index
      },
      CHANGE_DETAIL_INDEX (state, index) {
          state.word_detail_index = index
      }
  },
  actions: {
      updateWordList ({ commit }, data) {
          commit('UPDATE_WORD_LIST',data)
      },
      updateReadingData ({ commit }, data) {
          commit('UPDATE_READING_DATA',data)
      },
      updateUserInfo ({ commit }, data) {
          commit('UPDATE_USER_INFO',data)
      },
      changeDetailIndex ({ commit }, index) {
          commit('CHANGE_DETAIL_INDEX',index)
      },
      setCampInfo ({ commit }, data) {
          commit('SET_CAMP_INFO',data)
      },
      updateActiveDate ({ commit }, date) {
          commit('UPDATE_ACTIVE_DATE',date)
      },
      initStateList ({ commit }, newList) {
          commit('INIT_STATE_LIST',newList)
      },
      updateStudyProgress ({ commit }, progress) {
          commit('UPDATE_STUDY_PROGRESS', progress)
      },
      setActiveDetail ({ commit }, data) {
          commit('SET_ACTIVE_DETAIL', data)
      },
      updateStudyState ({ commit }, newState) {
          commit('UPDATE_STUDY_STATE', newState)
      },
      updateReviewData ({ commit }, index) {
          commit('UPDATE_REVIEW_DATA', index)
      },
      updateStudyData ({ commit }, index) {
          commit('UPDATE_STUDY_DATA', index)
      },
      initDetailIndex ({ commit }, index) {
          commit('INIT_DETAIL_INDEX', index)
      }
    }
})
