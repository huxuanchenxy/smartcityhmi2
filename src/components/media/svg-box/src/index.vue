<!-- <template>
  <div class="datav-wrapper" :style="wraperStyle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :style="{ backgroundColor: configStore.svg.background_color }"
      width="100%"
      height="100%"
    >
      <g
        :transform="
          `translate(${configStore.svg.position_center.x +
            svgEditLayoutStore.center_offset.x},${configStore.svg.position_center.y +
            svgEditLayoutStore.center_offset.y})rotate(${0})scale(${configStore.svg.scale})`
        "
      >
        <g
          :key="item.id"
          :transform="`translate(${item.x},${item.y})rotate(0)scale(1)`"
          v-show="item.display"
        >
          <g :class="`${getCommonClass(item)}`">
            <g
              :transform="
                `rotate(${item.rotate},${item.actual_bound.x + item.actual_bound.width / 2},${item
                  .actual_bound.y +
                  item.actual_bound.height / 2}) scale(1)`
              "
              @mousedown="onSvgMouseDown(item, index, $event)"
              @mouseenter="onSvgMouseEnter(item, index, $event)"
              @mouseleave="onSvgMouseLeave(item, index, $event)"
              @contextmenu="onSvgContextMenuEvent(item, index, $event)"
            >
              <use
                v-else-if="item.type === EDoneJsonType.File"
                :xlink:href="`#svg-${item.name}`"
                v-bind="prosToVBind(item)"
                width="100"
                height="100"
                :id="item.id"
                :transform="
                  `translate(${item.actual_bound.x + item.actual_bound.width / 2},${item
                    .actual_bound.y +
                    item.actual_bound.height / 2}) scale(${item.scale_x},${
                    item.scale_y
                  }) translate(${-(item.actual_bound.x + item.actual_bound.width / 2)},${-(
                    item.actual_bound.y +
                    item.actual_bound.height / 2
                  )})`
                "
              ></use>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { SvgBox } from './Svg-box'
import { useEventCenter } from '@/mixins/event-center'

export default defineComponent({
  name: 'VSvgBox',
  props: {
    com: {
      type: Object as PropType<SvgBox>,
      required: true,
    },
  },
  setup(props) {
    const config = toRef(props.com, 'config')
    const attr = toRef(props.com, 'attr')

    useEventCenter(props.com)

    const wraperStyle = computed(() => {
      const style = {
        transform: 'translateZ(0px)',
        width: `${attr.value.w}px`,
        height: `${attr.value.h}px`,
        'border-radius': `${config.value.borderRadius}px`,
        filter: `blur(${config.value.filter.blur})`,
        'backdrop-filter': `blur(${config.value.backdropFilter.blur})`,
      }

      return style
    })


    return {
      config,
      wraperStyle
    }
  },
})
</script> -->
