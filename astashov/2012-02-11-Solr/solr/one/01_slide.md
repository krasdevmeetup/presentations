!SLIDE
# Solr #

!SLIDE
# Apache Lucene + Solr
# API, JSON, WEB

!SLIDE bullets incremental
# Фичи

* Полнотекстовый поиск
* Фасетный поиск
* Подсветка
* Индексирует все подряд (SQL, XML, PDF, DOC)

!SLIDE
# Rails
# gem install sunspot
# [README](http://github.com/sunspot/sunspot)

* Поддерживает почти все из Solr 3.5
* Легко расширять

!SLIDE left smaller left
# Использование

    @@@ ruby
    class Post < ActiveRecord::Base
      searchable do
        text :body
        integer :user_id
        string :title
        integer :category_ids, :multiple => true
        string :comments, :multiple => true, :stored => true do
          comments.map(&:body)
        end
      end
    end

    posts = Post.search do |s|
      s.fulltext "blabla"
      with(:user_id, 1)
      with(:category_ids, 4)
    end.results

!SLIDE
# Самая мякотка


!SLIDE small
# Multiple values

    @@@ ruby
    class Post < ActiveRecord::Base
      searchable do
        integer :category_ids, :multiple => true
      end
    end

    Post.search { with(:category_ids).any_of([3,4]) }
    Post.search { with(:category_ids).all_of([3,4]) }

!SLIDE small
# Stored values

    @@@ ruby
    class Post < ActiveRecord::Base
      searchable do
        integer(:id)
        string :blabla, :stored => true do
          very.heavy.calculations
        end
      end
    end

    hits = Post.search { with(:id, 1) }.hits
    hits.first.stored(:blabla)
    # => Результат наших очень тяжелых вычислений

!SLIDE smaller
# Группировка

    @@@ ruby
    class Post < ActiveRecord::Base
      searchable do
        integer(:user_id)
        integer(:rating)
        string(:category_id_str)
      end
    end

    search = Post.search do
      with(:user_id, 1)
      group :category_id_str do
        order_by(:rating, :desc)
        limit 5
      end
    end

    search.group(:category_id_str).groups.each do |g|
      g.results.each do |r|
        ...
      end
    end

!SLIDE small
# Plugins

    @@@ ruby
    class Post < ActiveRecord::Base
      searchable do
        payload :payload_tag
      end

      def payload_tag
        # Like "123456|1.0 FF0312|0.8 EFAB34|0.6"
      end
    end

    Post.search do
      adjust_solr_params do |params|
        params[:q] = "FF0312"
      end
    end.results

!SLIDE left left
# Отладка

SOLR Request (4.9ms)  [ path=#<RSolr::Client:0x007fa0392c1060>
parameters={data: **fq=type%3AProjectTheme&fq=occasion_ids_im%
3A24&fq=product_base_type_sm%3Acard&start=0&rows=30&facet=true&
f.number_of_photos_on_front_cover_im.facet.mincount=0&
facet.field=number_of_photos_on_front_cover_im&q=%2A%3A%2A**,
method: post, params: {:wt=>:ruby}, query: wt=ruby, headers:
{"Content-Type"=>"application/x-www-form-urlencoded"},
path: select, uri: **http://localhost:8982/solr/select?wt=ruby**} ]

## Запрос

**http://localhost:8982/solr/select?wt=ruby&fq=type%3A...**

!SLIDE
# Тестирование
# gem install sunspot_test

!SLIDE small

    @@@ ruby
    describe Post, :search => true do

      before do
        Sunspot.remove_all!
        @post = Post.create!(:title => "blabla")
        @post.index!
        Sunspot.commit
        @post
      end

      it "does something very awesome" do
        search = Post.search { with(:title, "blabla") }
        search.results.should == [@post]
      end

    end

!SLIDE smbullets incremental left
# Sphinx vs Solr

* Solr может индексировать проприетарные форматы (PDF, Doc)
* У Solr есть плагины
* У Solr есть веб-интерфейс, веб API, вывод в JSON
* Sphinx индексирует и ищет быстрее, он маленький и легкий
* Sphinx может возвращать только ID, у Solr есть stored values
* Sphinx более тесно интегрирован с MySQL

!SLIDE
# Конец. Аплодисменты.
