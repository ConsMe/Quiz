<template>
  <div>
    <h3 class=" mt-5 mb-5 text-center">Конструктор квиза</h3>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div v-for="(q, i) in quiz" :key="i">
          <div
            class="line overflow-hidden"
            :class="{
              invisible: q.invisible,
              'h-0': q.invisible,
              'mb-1': !q.invisible,
            }">
            <div
              class=" d-inline w-auto"
              :style="{ marginLeft: `${q.level * 1.25}rem` }">
              <button
                class="btn btn-sm mr-1"
                :class="{invisible: q.type !== 'Q'}"
                type="button"
                style="width: 1rem;padding: 0;"
                @click="$set(quizRaw.data[i], 'isCollapsed', !q.isCollapsed)">
                <!-- data-toggle="tooltip"
                :title="q.isCollapsed ? 'развернуть' : 'свернуть'"> -->
                {{ q.isCollapsed ? '+' : '-' }}
              </button>
              <button
                class="btn"
                :class="[q.type === 'Q' ? 'btn-primary' : 'btn-light']"
                type="button"
                v-if="!q.isEdit"
                @click="editText(i, $event)">
                {{ q.text }}
              </button>
              <input
                type="text"
                v-else
                class="form-control d-inline-block align-middle shadow-none"
                :class="[q.type === 'Q' ? 'text-white bg-primary' : 'bg-light']"
                v-model.trim="q.text"
                :ref="`text${i}`"
                :style="{ width: q.isEdit }"
                style="min-width: 15rem;"
                @blur="$set(quizRaw.data[i], 'isEdit', false)" />
            </div>
            <template v-if="q.type === 'Q'">
              <select
                v-model="q.inputType"
                class="custom-select custom-select-sm d-inline w-auto ml-1 shadow-none">
                <option value="radio">радио</option>
                <option value="checkbox">чекбокс</option>
              </select>
              <button
                class="btn btn-outline-primary btn-sm ml-1 btn-fade btnsm shadow-none"
                type="button"
                data-toggle="tooltip"
                title="добавить ответ"
                @click="addQ(q, i)">
                +
              </button>
            </template>
            <template v-else>
              <button
              type="button"
              :class="{
                'btn-fade': !q.isEnd,
                'btn-outline-info': !q.isEnd,
                'btn-info': q.isEnd,
              }"
              class=" btn btn-sm ml-1 btnsm shadow-none"
              @click="endBranch(q, i)">
              конец ветки
            </button>
            </template>
            <button
              class="btn btn-outline-danger btn-sm ml-1 btn-fade btnsm shadow-none"
              type="button"
              @click="remove(q, i)"
              data-toggle="tooltip"
              :title="q.type === 'Q' ? 'удалить ветку' : 'удалить ответ'"
              v-if="i">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class=" text-center mt-5">
      <button class=" btn btn-primary" type="button" @click="save">Save</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      quizRaw: localStorage.getItem('quiz') ? JSON.parse(localStorage.getItem('quiz')) : {
        lastId: 3,
        data:
        [{
          type: 'Q', inputType: 'radio', id: 1, isRoot: true, level: 1, text: 'Какой договор вам нужен?',
        }, {
          type: 'A', forId: 1, isEnd: false, level: 2, text: 'Купли-продажи недвижимости', isEdit: false,
        }, {
          type: 'Q', id: 2, inputType: 'radio', level: 3, text: 'Что является предметом договора?', isEdit: false,
        }, {
          type: 'A', forId: 2, isEnd: false, level: 4, text: 'Квартира', isEdit: false,
        }, {
          type: 'Q', id: 3, inputType: 'radio', level: 5, text: 'Сколько собственников квартиры?', isEdit: false,
        }, {
          type: 'A', forId: 2, isEnd: true, level: 4, text: 'Дом', isEdit: false,
        }, {
          type: 'A', forId: 2, isEnd: true, level: 4, text: 'Гараж', isEdit: false,
        }, {
          type: 'A', forId: 1, isEnd: true, level: 2, text: 'Купли-продажи авто', isEdit: false,
        }, {
          type: 'A', forId: 1, isEnd: true, level: 2, text: 'Купли-продажи бизнеса', isEdit: false,
        }],
      },
    };
  },
  computed: {
    quiz() {
      let index = null;
      return this.quizRaw.data.map((q, i) => {
        if (index === null && q.type === 'Q' && q.isCollapsed) {
          const ir = this.quizRaw.data.slice().reverse().findIndex((qq) => qq.forId === q.id);
          if (ir >= 0) {
            index = this.quizRaw.data.length - 1 - ir;
            return q;
          }
        }
        if (index !== null) {
          if (i > index) {
            index = null;
            return q;
          }
          const qz = JSON.parse(JSON.stringify(q));
          qz.invisible = true;
          return qz;
        }
        return q;
      });
    },
  },
  watch: {
    quiz() {
      this.$nextTick(() => {
        $(() => {
          $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
        });
      });
    },
  },
  mounted() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    });
  },
  methods: {
    addQ(q, i) {
      const ir = this.quizRaw.data.slice(i).findIndex((qq) => qq.level < q.level);
      const index = ir >= 0 ? ir + i : this.quizRaw.data.length;
      this.quizRaw.data.splice(index, 0, {
        type: 'A',
        forId: q.id,
        isEnd: true,
        level: q.level + 1,
        text: 'Ответ',
      });
    },
    endBranch(q, i) {
      const isEnd = !q.isEnd;
      this.$set(this.quizRaw.data[i], 'isEnd', isEnd);
      if (isEnd) {
        const index = this.quizRaw.data.slice(i + 1).findIndex((qq) => qq.level <= q.level);
        if (index >= 0) {
          this.quizRaw.data.splice(i + 1, index);
        } else {
          this.quizRaw.data.splice(i + 1, 1);
        }
      } else {
        this.quizRaw.lastId += 1;
        this.quizRaw.data.splice(i + 1, 0, {
          type: 'Q',
          id: this.quizRaw.lastId,
          inputType: 'radio',
          level: q.level + 1,
          text: 'Вопрос',
        });
      }
    },
    editText(index, e) {
      const btnWidth = e.target.offsetWidth;
      setTimeout(() => {
        this.$set(this.quizRaw.data[index], 'isEdit', `${btnWidth}px`);
        setTimeout(() => {
          this.$refs[`text${index}`][0].focus();
        }, 0);
      }, 0);
    },
    remove(q, i) {
      const index = this.quizRaw.data.slice(i + 1).findIndex((qq) => qq.level <= q.level);
      if (index >= 0) {
        this.quizRaw.data.splice(i, index + 1);
      } else {
        this.quizRaw.data.splice(i, 1);
      }
      if (q.type === 'Q') {
        this.$set(this.quizRaw.data[i - 1], 'isEnd', true);
      }
    },
    save() {
      localStorage.setItem('quiz', JSON.stringify(this.quizRaw));
    },
  },
};
</script>

<style lang="scss">
button.btn.btnsm {
  line-height: 1rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
button.btn.btn-fade {
  opacity: 0;
  transition: opacity 0.5s;
}
.line:hover {
  .btn-fade {
    opacity: 1;
  }
}
.h-0 {
  height: 0;
}
</style>
