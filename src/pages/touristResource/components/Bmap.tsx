import { memo, useEffect, useRef, useCallback, useState } from "react";
import { Modal, Input, Dropdown } from "antd";
import debounce from "lodash/debounce";

function initialDropdownMenu() {
  return {
    items: [{ key: "", label: "", city: "", business: "", district: "" }],
    onClick: (...args: any[]) => {},
  };
}

function Bmap(props: any) {
  const {
    width = "100%",
    height = 300,
    location = "安徽省",
    open,
    onCancel,
    onSuccess,
    lat,
    lng,
  } = props;
  const mapRef = useRef<BMapGL.Map>(null);
  const latlngRef = useRef<BMapGL.Point>();

  const [address, setAddress] = useState("");
  const [dropdownMenu, setDropdownMenu] = useState(initialDropdownMenu);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownMenuRef = useRef<any>([]);

  const displayInfoWindow = useCallback(
    async (point: BMapGL.Point, address?: string) => {
      let message = address;
      if (typeof address === "undefined") {
        const response = await getLocation(point);
        message = response.address;
      }
      const infoWindow = new BMapGL.InfoWindow(message!, {
        maxWidth: 300,
        height: 65,
        title: "当前定位",
      });
      mapRef.current!.openInfoWindow(infoWindow, point);
    },
    []
  );

  // 移除之前的定位点
  const clearMarker = useCallback(() => {
    mapRef.current?.clearOverlays();
  }, []);

  const addMarker = useCallback((point: BMapGL.Point) => {
    mapRef.current!.addOverlay(new BMapGL.Marker(point));
    latlngRef.current = point;
  }, []);

  useEffect(() => {
    if (open) {
      const zoom = 12;
      const point = lat && lng ? new BMapGL.Point(lng, lat) : location;
      if (!mapRef.current) {
        // @ts-ignore
        mapRef.current = new BMapGL.Map("other-page-baidu-map");
        // @ts-ignore
        mapRef.current.centerAndZoom(point, zoom);
        mapRef.current.enableScrollWheelZoom();

        if (lng && lat) {
          addMarker(point);
          displayInfoWindow(point);
        }

        mapRef.current.addEventListener("click", (event: any) => {
          const { lng, lat } = event.latlng;
          clearMarker();
          const point = new BMapGL.Point(lng, lat);
          addMarker(point);
          displayInfoWindow(point);
        });

        const onSearchComplete = debounce(handleSearch, 300);
        const ac = new BMapGL.Autocomplete({
          input: "suggestId",
          location: mapRef.current,
          onSearchComplete,
        });
      } else {
        // 加一个延时，否则地图定位点（经纬度）不在地图中心位置。
        setTimeout(() => mapRef.current!.centerAndZoom(point, zoom), 200);
        if (lat && lng) {
          addMarker(point);
          displayInfoWindow(point);
        }
      }
    } else {
      clearMarker();
    }
  }, [open, location, onSuccess, lat, lng]);

  const handleOk = useCallback(() => {
    setOpenDropdown(() => false);
    setAddress(() => "");
    if (openDropdown) {
      setTimeout(() => onSuccess?.(latlngRef.current), 300);
    } else {
      onSuccess?.(latlngRef.current);
    }
  }, [openDropdown]);

  const handleCancel = useCallback(() => {
    setOpenDropdown(() => false);
    setAddress(() => "");
    if (openDropdown) {
      setTimeout(() => onCancel?.(), 300);
    } else {
      onCancel?.();
    }
  }, [onCancel, openDropdown]);

  const handleChangeInputSearch = useCallback((event: any) => {
    setAddress(() => event.target.value);
  }, []);

  const handleBlurInputSearch = useCallback(() => {
    setTimeout(() => setOpenDropdown(() => false), 200);
  }, []);

  // 下拉选项框
  const handleDropdownSelect = useCallback(
    (opts: any) => {
      const { key } = opts;
      const target = dropdownMenuRef.current.find(
        (item: any) => item.key === key
      );
      if (target) {
        const myValue =
          target.province +
          target.city +
          target.district +
          target.street +
          target.business;
        console.log(myValue);
        const myFun = () => {
          const pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
          mapRef.current!.centerAndZoom(pp, 18);
          clearMarker();
          addMarker(pp);
          displayInfoWindow(pp, target.business);
          setOpenDropdown(() => false);
          setAddress(() => target.business);
        };
        const local: any = new BMapGL.LocalSearch(mapRef.current!, {
          onSearchComplete: myFun,
        });
        local.search(myValue);
        // const geo = new BMapGL.Geocoder();
        // 获取详细地址的经纬度
        // const callback = (point: BMapGL.Point) => {
        //   clearMarker();
        //   addMarker(point);
        //   displayInfoWindow(point, target.business);
        //   setOpenDropdown(() => false);
        //   setAddress(() => target.business);
        // };
        // // @ts-ignore
        // geo.getPoint(target.business, callback, target.city);
      }
    },
    [dropdownMenu]
  );

  // 搜索查询
  const handleSearch = useCallback(
    (response: any) => {
      // 如果搜索框此时没有获取到焦点则不处理
      if (document.activeElement?.id !== "suggestId") return;

      const { _pois } = response;
      const nextMenus: any = [];
      if (_pois?.length > 0) {
        for (let i = 0; i < _pois.length; i++) {
          const { city, district, business } = _pois[i];

          nextMenus.push({
            city,
            business,
            district,
            key: i + "",
            label: (
              <span>
                {business}
                <span style={{ color: "#ccc", marginLeft: 20 }}>
                  {city}
                  {district}
                </span>
              </span>
            ),
          });
        }
      } else {
        nextMenus.push({
          disabled: true,
          key: "1",
          label: <span style={{ color: "#ccc" }}>当前没有搜索到任何内容</span>,
        });
      }
      // 更新下拉菜单，并打开
      setDropdownMenu(() => ({
        items: nextMenus,
        onClick: handleDropdownSelect,
      }));
      setOpenDropdown(() => true);
      // 将 menu 赋值到 ref 上，是因为 dropdownClick 事件逻辑内部有一个异步方法，不能通过 state 获取正确的值。
      dropdownMenuRef.current = nextMenus;
    },
    [handleDropdownSelect]
  );

  return (
    <Modal
      width={800}
      open={open}
      onOk={handleOk}
      closable={false}
      maskClosable={false}
      onCancel={handleCancel}
    >
      <div style={{ position: "relative" }} id="sxx-map">
        <Dropdown
          open={openDropdown}
          trigger={["click"]}
          menu={dropdownMenu as any}
          getPopupContainer={getContainer}
        >
          <Input.Search
            id="suggestId"
            value={address}
            style={searchStyle}
            placeholder="输入你要搜索的地址"
            onBlur={handleBlurInputSearch}
            onChange={handleChangeInputSearch}
          />
        </Dropdown>
        <div
          style={{ width, height, marginTop: 12 }}
          id="other-page-baidu-map"
        />
      </div>
    </Modal>
  );
}

export default memo(Bmap);

// 根据 marker 点返回详细地址
function getLocation(point: BMapGL.Point): Promise<BMapGL.GeocoderResult> {
  const geo = new BMapGL.Geocoder();
  return new Promise((resolve, reject) => {
    geo.getLocation(point, (result: BMapGL.GeocoderResult) => {
      if (result) {
        return resolve(result);
      } else {
        return reject(new Error("获取信息失败"));
      }
    });
  });
}

function getContainer() {
  return document.getElementById("sxx-map")!;
}
const searchStyle = { width: 260, marginLeft: "auto", display: "block" };
