import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NavComponent} from "../nav/nav.component";
import {RouterLinkActive} from "@angular/router";
import {UtilityService} from "../services/util-service/utility.service";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-resource',
    standalone: true,
  imports: [
    NgForOf,
    NavComponent,
    RouterLinkActive,
    NgClass,
    FormsModule,
    NgIf
  ],
    providers: [UtilityService],
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent {

    user: any;
    activeFilter: string = 'All';
    searchText: string = '';

    constructor(private utilityService: UtilityService) {
    }

    // table settings
    settings = {
        columns: {
            resource: {
                title: 'Resource',
                type: 'html'
            },
            platform: {
                title: 'Platform'
            },
            description: {
                title: 'Description'
            }
        },

        // custom css styling (from bootstrap)
        attr: {
            class: 'table table-striped table-bordered table-responsive-md table-hover'
        },

        // actions
        actions: {
            add: false,
            edit: false,
            delete: false
        }
    };

    // clear search
    clearSearch() {
      this.searchText = '';
    }

    // filter resources by tag and search text
    filteredResources() {
      return this.resourceData.filter(resource => {
        if (this.activeFilter === 'All') {
          return true;
        }
        return resource.tags.includes(this.activeFilter);
      }).filter(resource => {
        if (this.searchText === '') {
          return true;
        }
        return resource.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
    }

    setActiveFilter(tag: any) {
      this.activeFilter = tag;
    }

    // get all tags in the resource data
    getAllTags() {
      const allTags = new Set();
      this.resourceData.forEach(resource => {
        resource.tags.forEach(tag => allTags.add(tag));
      });
      return Array.from(allTags);
    }

    // data object for creation resources
    resourceData = [
      {
        "name": "Constructed Language",
        "url": "https://en.wikipedia.org/wiki/Constructed_language",
        "platform": "Wikipedia",
        "description": "Constructed Language Wikipedia Page",
        "tags": ["101", "Reference"]
      },
      {
        "name": "Language Creation Society",
        "url": "https://conlang.org/",
        "platform": "Web",
        "description": "The Language creation society (CLS) is the home to all things Conlang. Here, you can find even more resources (in the form of their 'conlanger's Library'), community information, a glossary of conlang terms and more!",
        "tags": ["Community", "Reference", "Resources"]
      },
      {
        "name": "The Language Construction Kit",
        "url": "http://www.zompist.com/kit.html",
        "platform": "Web",
        "description": "Zompist is an old, but trusted, resource. This resource includes all the nitty gritty technical details on creating languages. You can find where to get a 'Syntax construction Kit,' 'Phonology Builder,' and more!",
        "tags": ["101", "Tools", "Technical"]
      },
      {
        "name": "Conlang Facebook Group",
        "url": "https://www.facebook.com/groups/Conlang/",
        "platform": "Facebook",
        "description": "This facebook group is a home for language creators and fans! Currently near 3k members and growing, this group discusses all aspects of linguistics and languages, and the scripts used for writing them.",
        "tags": ["Community", "Discussion"]
      },
      {
        "name": "Linguistics and Conlangs Facebook Group",
        "url": "http://www.facebook.com/groups/Linguistics.and.conlangs/",
        "platform": "Facebook",
        "description": "This is a group where people can discuss conlanging (making a language), talk about linguistics and share language-related resources. They have a good number of affiliated resources that are more specific (Semitic Conlangs, Con-sign languages, and more!)",
        "tags": ["Community", "Discussion", "Resources"]
      },
      {
        "name": "Fiat Lingua",
        "url": "http://fiatlingua.org/",
        "platform": "Web",
        "description": "Fiat Lingua is an online archive of conlang articles. It’s intended to be a venue to host lengthier, journal-style articles written by members of the conlang community. All articles will be immediately available for download for free as .pdf files upon publication. On occasion, the LCS may collect the various articles that have been published at Fiat Lingua and produce a .pdf and print anthology, which would be available for purchase. Initially, though, publication of any article will be digital. All articles are subject to editing and review.",
        "tags": ["Resources", "Articles", "Reference"]
      },
      {
        "name": "Omniglot Encyclopedia - Conscripts",
        "url": "https://omniglot.com/conscripts/index.htm",
        "platform": "Web",
        "description": "Omniglot is an online encyclopedia focused on writing systems and languages.",
        "tags": ["Reference", "Writing Systems", "Languages"]
      },
      {
        "name": "IPA Picker",
        "url": "https://r12a.github.io/pickers/ipa/",
        "platform": "Web",
        "description": "IPA Picker is a website that allows you to choose IPA fonts from a clickable interface.",
        "tags": ["Tools", "Technical"]
      },
      {
        "name": "Conlangs Reddit",
        "url": "https://www.reddit.com/r/conlangs/",
        "platform": "Reddit",
        "description": "A subreddit dedicated to the discussion and creation of constructed languages.",
        "tags": ["Community", "Discussion"]
      },
      {
        "name": "Worldbuilding Reddit",
        "url": "https://www.reddit.com/r/worldbuilding/",
        "platform": "Reddit",
        "description": "A subreddit focused on the art of worldbuilding, including the creation of languages, cultures, and histories.",
        "tags": ["Community", "Discussion", "Worldbuilding"]
      },
      {
        "name": "Conlangs Discord",
        "url": "https://discord.com/invite/conlangs",
        "platform": "Discord",
        "description": "A Discord server where language creators and enthusiasts can chat, share ideas, and collaborate on projects.",
        "tags": ["Community", "Discussion", "Collaboration"]
      },
      {
        "name": "Endangered Languages Project",
        "url": "http://www.endangeredlanguages.com/",
        "platform": "Web",
        "description": "A collaborative online resource dedicated to supporting the documentation and revitalization of endangered languages.",
        "tags": ["Reference", "Resources", "Languages"]
      },
      {
        "name": "Ethnologue",
        "url": "https://www.ethnologue.com/",
        "platform": "Web",
        "description": "An authoritative resource on world languages, providing detailed information on language demographics, locations, and classification.",
        "tags": ["Reference", "Languages", "Research"]
      },
      {
        "name": "Glottolog",
        "url": "https://glottolog.org/",
        "platform": "Web",
        "description": "A comprehensive database of the world's languages, dialects, and language families, with an emphasis on lesser-known languages.",
        "tags": ["Reference", "Languages", "Research"]
      },
      {
        "name": "Artifexian YouTube Channel",
        "url": "https://www.youtube.com/user/Artifexian",
        "platform": "YouTube",
        "description": "A YouTube channel dedicated to worldbuilding and conlanging, providing tutorials and inspiration for creators.",
        "tags": ["Community", "Discussion", "Worldbuilding", "Videos"]
      }
    ]
}
