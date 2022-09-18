import { Component, OnInit } from '@angular/core';
import { VideoItem } from 'src/videoitem';
import { VIDEOITEMS } from 'src/mock-videoitems';

@Component({
  selector: 'app-video-item-list',
  templateUrl: './video-item-list.component.html',
  styleUrls: ['./video-item-list.component.css']
})

export class VideoItemListComponent implements OnInit {


  videoItems = VIDEOITEMS;
  selectedItem?: VideoItem;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(video: VideoItem): void {
    this.selectedItem = video;
  }
}
